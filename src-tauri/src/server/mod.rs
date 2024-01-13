mod logger;

use std::collections::HashMap;
use std::path::PathBuf;
use std::pin::Pin;
use std::str::FromStr;
use std::sync::OnceLock;
use std::task::Context;
use std::task::Poll;

use bytes::Bytes;
use futures::stream::Stream;
use lazy_static::lazy_static;
use read_progress_stream::ReadProgressStream;
use salvo::http::Body;
use salvo::http::ReqBody;
use salvo::prelude::*;
use serde::Serialize;
use tauri::Window;
use tokio::fs;
use tokio::fs::File;
use tokio::sync::RwLock;
use tokio_util::io::StreamReader;
#[cfg(not(debug_assertions))]
use {salvo::serve_static::StaticDir, std::env};

use crate::lazy::LOCAL_IP;
use crate::server::logger::Logger;

const UPLOAD_EVENT: &str = "upload://progress";
pub static MAIN_WINDOW: OnceLock<Window> = OnceLock::new();

lazy_static! {
    pub static ref DOWNLOADS_DIR: PathBuf = dirs::download_dir().unwrap().join("alley");
    pub static ref QR_CODE_MAP: RwLock<HashMap<u64, bool>> = RwLock::new(HashMap::new());
}

type Result<T> = std::result::Result<T, ServerError>;

enum ServerError {
    Bad(String),
    Internal,
}

#[async_trait]
impl Writer for ServerError {
    async fn write(self, _req: &mut Request, _depot: &mut Depot, res: &mut Response) {
        match self {
            ServerError::Bad(s) => {
                res.status_code(StatusCode::BAD_REQUEST);
                res.render(s);
            }
            ServerError::Internal => {
                res.status_code(StatusCode::INTERNAL_SERVER_ERROR);
            }
        }
    }
}

#[derive(Debug, Serialize, Clone)]
struct Task {
    name: String,
    progress: f64,
}

impl Into<String> for Task {
    fn into(self) -> String {
        format!(
            r#"{{"name":"{}", "progress":{}}}"#,
            self.name, self.progress
        )
    }
}

impl Task {
    fn new<S: Into<String>>(name: S, progress: f64) -> Self {
        Self {
            name: name.into(),
            progress,
        }
    }
}

#[handler]
async fn index(res: &mut Response) {
    res.render(Redirect::found(format!(
        "http://{}:5173",
        LOCAL_IP.to_owned()
    )))
}

fn parse_string<T: FromStr>(input: &str) -> Result<T> {
    input.parse::<T>().map_err(|_| {
        error!("字符串无法转换: {}", input);
        ServerError::Bad("无法转换字符串".to_owned())
    })
}

#[handler]
async fn ping(req: &Request, res: &mut Response) -> Result<()> {
    let queries = req.queries();
    let ts = queries.get("ts");

    let id: u64 = match ts {
        Some(s) => parse_string(&s)?,
        None => return Err(ServerError::Bad("缺少 ts".to_string())),
    };

    let mut qr_code_map = QR_CODE_MAP.write().await;
    if qr_code_map.contains_key(&id) {
        return Err(ServerError::Bad("此二维码已被使用".to_string()));
    }

    qr_code_map.insert(id, true);

    let remote_ip = req.remote_addr().to_string();
    debug!("有客户端发起连接: {}", remote_ip);

    // 客户端重定向到首页
    res.render(Redirect::found("/"));

    Ok(())
}

struct FileBody {
    inner: ReqBody,
}

impl Stream for FileBody {
    type Item = std::result::Result<Bytes, std::io::Error>;

    fn poll_next(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        let body = &mut self.inner;
        match Body::poll_frame(Pin::new(body), cx) {
            Poll::Ready(Some(Ok(frame))) => {
                let frame_bytes: Bytes = frame.into_data().unwrap();
                Poll::Ready(Some(Ok(frame_bytes)))
            }
            Poll::Ready(Some(Err(e))) => Poll::Ready(Some(Err(e))),
            Poll::Ready(None) => Poll::Ready(None),
            Poll::Pending => Poll::Pending,
        }
    }
}

#[handler]
async fn upload(req: &mut Request) -> Result<()> {
    let name = match req.query::<String>("name") {
        Some(s) => s,
        None => return Err(ServerError::Bad("文件名为空".into())),
    };
    debug!("文件名: {:?}", name);

    let size: u64 = match req.header("content-length") {
        Some(n) => n,
        None => return Err(ServerError::Bad("文件长度为空".into())),
    };

    let body = req.take_body();
    let stream = ReadProgressStream::new(
        FileBody { inner: body },
        Box::new({
            let name = name.clone();
            move |_, progress| {
                let name = name.clone();
                if let Some(w) = MAIN_WINDOW.get() {
                    let _ = w.emit(
                        UPLOAD_EVENT,
                        Task::new(name, (progress * 10000 / size) as f64 / 100.0),
                    );
                }
            }
        }),
    );

    let file_path = DOWNLOADS_DIR.join(&name);

    let mut stream_reader = StreamReader::new(stream);
    let mut file = File::create(&file_path).await.map_err(|e| {
        error!("新建文件时出错: {}", e);
        ServerError::Internal
    })?;
    if let Err(e) = tokio::io::copy(&mut stream_reader, &mut file).await {
        error!("复制文件流时出错: {}", e);

        // 上传未完成时删除本地未完成的文件
        fs::remove_file(file_path).await.map_err(|e| {
            error!("复制文件流时出错: {}", e);
            ServerError::Internal
        })?;
    }

    Ok(())
}

pub async fn serve() {
    if !DOWNLOADS_DIR.exists() {
        fs::create_dir(&*DOWNLOADS_DIR).await.unwrap();
    }

    let mut router = Router::new()
        .hoop(Logger::new())
        .push(Router::with_path("connect").get(ping))
        .push(Router::with_path("upload").post(upload));

    #[cfg(debug_assertions)]
    {
        router = router.get(index);
    }

    #[cfg(not(debug_assertions))]
    {
        #[cfg(any(target_os = "windows", target_os = "macos"))]
        let static_dir = {
            let current_exe = env::current_exe().unwrap();
            let current_dir = current_exe.parent().unwrap().parent().unwrap();

            debug!(
                "当前工作目录:{:?}({})",
                current_dir,
                current_dir.is_absolute()
            );

            #[cfg(target_os = "windows")]
            let static_dir = current_dir.join("alley/static");
            #[cfg(target_os = "macos")]
            let static_dir = current_dir.join("Resources/static");

            static_dir
        };

        #[cfg(target_os = "linux")]
        let static_dir = "/usr/share/alley/static";

        router = router.push(
            Router::with_path("<**path>").get(
                StaticDir::new([static_dir])
                    .defaults("index.html")
                    .auto_list(true),
            ),
        );
    }

    let acceptor = TcpListener::new("0.0.0.0:5800").bind().await;
    Server::new(acceptor).serve(router).await;
}
