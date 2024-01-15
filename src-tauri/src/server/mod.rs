mod logger;

use std::collections::HashMap;
#[cfg(all(not(debug_assertions), any(target_os = "windows", target_os = "macos")))]
use std::env;
use std::path::PathBuf;
use std::pin::Pin;
use std::process;
use std::sync::OnceLock;
use std::task::Context;
use std::task::Poll;
use std::time::Instant;

use bytes::Bytes;
use futures::stream::Stream;
use log::debug;
use log::info;
use read_progress_stream::ReadProgressStream;
use salvo::http::Body;
use salvo::http::ReqBody;
use salvo::prelude::*;
#[cfg(not(debug_assertions))]
use salvo::serve_static::StaticDir;
use serde::Serialize;
use tauri::Window;
use tokio::fs;
use tokio::fs::File;
use tokio::sync::RwLock;
use tokio_util::io::StreamReader;

#[cfg(debug_assertions)]
use crate::lazy::LOCAL_IP;
use crate::server::logger::Logger;

const UPLOAD_EVENT: &str = "upload://progress";
pub static MAIN_WINDOW: OnceLock<Window> = OnceLock::new();

lazy_static! {
    pub static ref DOWNLOADS_DIR: RwLock<PathBuf> =
        RwLock::new(dirs::download_dir().unwrap().join("alley"));
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
struct Task<'a> {
    name: &'a str,
    percent: f64,
    speed: f64, // MB/s
}

impl<'a> Task<'a> {
    fn new(name: &'a str, percent: f64, speed: f64) -> Self {
        Self {
            name,
            percent,
            speed,
        }
    }
}

#[cfg(debug_assertions)]
#[handler]
async fn index(res: &mut Response) {
    res.render(Redirect::found(format!(
        "http://{}:5173",
        LOCAL_IP.to_owned()
    )))
}

#[handler]
async fn connect(req: &Request, res: &mut Response) -> Result<()> {
    debug!("有客户端连接: addr={}", req.remote_addr());

    let id = match req.query::<u64>("ts") {
        Some(ts) => ts,
        None => {
            error!("请求 url 中未找到 ts");
            return Err(ServerError::Bad("缺少 ts".to_string()));
        }
    };

    let mut qr_code_map = QR_CODE_MAP.write().await;
    if qr_code_map.contains_key(&id) {
        error!("此二维码已被使用: {}", id);
        return Err(ServerError::Bad("此二维码已被使用".to_string()));
    }

    qr_code_map.insert(id, true);

    info!("客户端连接成功: addr={}", req.remote_addr());

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
    debug!("收到上传任务: addr={}", req.remote_addr());

    let name = match req.query::<String>("name") {
        Some(s) => s,
        None => {
            error!("请求地址中未找到文件名");
            return Err(ServerError::Bad("文件名为空".into()));
        }
    };
    debug!("文件名: {:?}", name);

    let size: u64 = match req.header("content-length") {
        Some(n) => n,
        None => {
            error!("请求头中未找到文件大小");

            return Err(ServerError::Bad("文件长度为空".into()));
        }
    };

    info!(
        "收到有效的上传任务: name={} size={} addr={}",
        name,
        size,
        req.remote_addr()
    );

    let start = Instant::now();

    let body = req.take_body();
    let stream = ReadProgressStream::new(
        FileBody { inner: body },
        Box::new({
            let name = name.clone();
            move |_, progress| {
                let name = name.clone();

                let progress_end = Instant::now();

                // cost 不能是秒, 秒转为整数可能是 0
                let cost = progress_end.duration_since(start).as_millis() as f64;

                let speed = (progress / 1024 / 1024) as f64 / (cost / 1000.0);

                if let Some(w) = MAIN_WINDOW.get() {
                    let _ = w.emit(
                        UPLOAD_EVENT,
                        Task::new(&name, (progress * 10000 / size) as f64 / 100.0, speed),
                    );
                }
            }
        }),
    );

    let file_path = DOWNLOADS_DIR.read().await.join(&name);

    debug!("保存的文件路径: {:?}", file_path);

    let mut stream_reader = StreamReader::new(stream);
    let mut file = File::create(&file_path).await.map_err(|e| {
        error!("新建文件时出错: path={:?} error={}", file_path, e);
        ServerError::Internal
    })?;
    if let Err(e) = tokio::io::copy(&mut stream_reader, &mut file).await {
        error!("复制文件流时出错: path={:?} error={}", file_path, e);

        // 上传未完成时删除本地未完成的文件
        fs::remove_file(&file_path).await.map_err(|e| {
            error!("删除未完成文件时出错: path={:?} error={}", file_path, e);
            ServerError::Internal
        })?;

        info!("已删除未完成文件: {:?}", file_path);
    }

    let end = Instant::now();

    info!(
        "已保存文件: path={:?} size={} addr={} cost={:?}",
        file_path,
        size,
        req.remote_addr(),
        end.duration_since(start)
    );

    Ok(())
}

pub async fn serve() {
    // 程序启动时的默认下载目录
    let default_downloads_dir = DOWNLOADS_DIR.read().await;
    if !default_downloads_dir.exists() {
        fs::create_dir(default_downloads_dir.clone()).await.unwrap();
    }
    drop(default_downloads_dir);

    let mut router = Router::new()
        .hoop(Logger::new())
        .push(Router::with_path("connect").get(connect))
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

    let acceptor = match TcpListener::new("0.0.0.0:5800").try_bind().await {
        Ok(a) => a,
        Err(e) => {
            error!("创建 TcpListener 失败: {}", e);
            process::exit(1);
        }
    };
    Server::new(acceptor).serve(router).await;
}
