mod logger;

use std::collections::HashMap;
#[cfg(all(not(debug_assertions), any(target_os = "windows", target_os = "macos")))]
use std::env;
use std::path::{Path, PathBuf};
use std::process;
use std::sync::OnceLock;
use std::time::Instant;

use salvo::fs::NamedFile;
use salvo::prelude::*;
#[cfg(not(debug_assertions))]
use salvo::serve_static::StaticDir;
use serde::{Deserialize, Serialize};
use tauri::Window;
use tokio::fs;
use tokio::fs::File;
use tokio::sync::RwLock;
use tokio_util::io::StreamReader;

use crate::error::AlleyResult;
#[cfg(debug_assertions)]
use crate::lazy::LOCAL_IP;
use crate::server::logger::Logger;
use crate::stream::ReadProgressStream;

const UPLOAD_EVENT: &str = "upload://progress";
pub static MAIN_WINDOW: OnceLock<Window> = OnceLock::new();

lazy_static! {
    pub(super) static ref DOWNLOADS_DIR: RwLock<PathBuf> =
        RwLock::new(dirs::download_dir().unwrap().join("alley"));
    pub(super) static ref QR_CODE_MAP: RwLock<HashMap<u64, bool>> = RwLock::new(HashMap::new());
    pub(super) static ref SEND_FILES: RwLock<Option<Vec<SendFile>>> = RwLock::new(None);
}

type Result<T> = std::result::Result<T, ServerError>;

#[derive(Serialize)]
#[serde(untagged)]
enum ServerError {
    Bad {
        error: String,
        advice: Option<String>,
    },
    Internal,
}

impl ServerError {
    fn new<'a, O1: Into<Option<&'a str>>, O2: Into<Option<&'a str>>>(
        error: O1,
        advice: O2,
    ) -> Self {
        let msg: Option<&str> = error.into();
        let advice: Option<&str> = advice.into();
        let advice = match advice {
            None => None,
            Some(s) => Some(s.to_owned()),
        };

        match msg {
            None => Self::Internal,
            Some(s) => Self::Bad {
                error: s.into(),
                advice,
            },
        }
    }
}

#[async_trait]
impl Writer for ServerError {
    async fn write(self, _req: &mut Request, _depot: &mut Depot, res: &mut Response) {
        match &self {
            ServerError::Bad { .. } => {
                res.status_code(StatusCode::BAD_REQUEST);
                res.render(Json(&self));
            }
            ServerError::Internal => {
                res.status_code(StatusCode::INTERNAL_SERVER_ERROR);
            }
        }
    }
}

#[derive(Debug, Serialize, Clone)]
struct Task<'a> {
    path: &'a Path,
    name: &'a str,
    percent: f64,
    speed: f64, // MB/s
    size: &'a str,
    aborted: bool,
}

impl<'a> Task<'a> {
    fn new(
        path: &'a Path,
        name: &'a str,
        size: &'a str,
        percent: f64,
        speed: f64,
        aborted: bool,
    ) -> Self {
        Self {
            path,
            name,
            percent,
            speed,
            size,
            aborted,
        }
    }
}

#[cfg(debug_assertions)]
#[handler]
async fn index(req: &Request, res: &mut Response) -> Result<()> {
    let mode = match req.query::<String>("mode") {
        None => {
            return Err(ServerError::new(
                "缺少查询参数: mode",
                "请通过小路互传扫码访问",
            ))
        }
        Some(s) => s,
    };

    res.render(Redirect::found(format!(
        "http://{}:5173?mode={}",
        LOCAL_IP.to_owned(),
        mode
    )));

    Ok(())
}

#[handler]
async fn connect(req: &Request, res: &mut Response) -> Result<()> {
    debug!("有客户端连接: addr={}", req.remote_addr());

    let id = match req.query::<u64>("ts") {
        Some(ts) => ts,
        None => {
            error!("请求 url 中未找到 ts");
            return Err(ServerError::new("缺少 ts", "请通过小路互传扫码访问"));
        }
    };

    let mode = match req.query::<String>("mode") {
        Some(s) => s,
        None => {
            error!("请求 url 中未找到 mode");
            return Err(ServerError::new("缺少 mode", "请通过小路互传扫码访问"));
        }
    };

    let mut qr_code_map = QR_CODE_MAP.write().await;
    if qr_code_map.contains_key(&id) {
        error!(message = "此二维码已被使用", id = id);
        return Err(ServerError::new(
            "此二维码已被使用",
            "请刷新小路互传页面生成新的二维码",
        ));
    }

    qr_code_map.insert(id, true);

    info!(message = "客户端连接成功", ip = ?req.remote_addr());

    // 客户端重定向到首页
    res.render(Redirect::found("/?mode=".to_owned() + &mode));

    Ok(())
}

fn format_file_size(size: u64) -> String {
    const KB: u64 = 1024;
    const MB: u64 = KB * 1024;
    const GB: u64 = MB * 1024;

    if size < KB {
        format!("{} B", size)
    } else if size < MB {
        format!("{:.2} KB", size as f64 / KB as f64)
    } else if size < GB {
        format!("{:.2} MB", size as f64 / MB as f64)
    } else {
        format!("{:.2} GB", size as f64 / GB as f64)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub(super) struct SendFile {
    name: String,
    path: PathBuf,
    extension: String,
    size: String,
}

impl SendFile {
    pub(super) fn new<S: Into<String>, P: Into<PathBuf>>(
        name: S,
        path: P,
        extension: &str,
        size: u64,
    ) -> Self {
        Self {
            name: name.into(),
            path: path.into(),
            extension: extension.to_uppercase(),
            size: format_file_size(size),
        }
    }
}

#[handler]
async fn download_file(req: &Request, res: &mut Response) -> Result<()> {
    let path = match req.param::<PathBuf>("path") {
        None => {
            error!("请求 url 中未找到 path");
            return Err(ServerError::new("缺少 path", "请通过小路互传扫码访问"));
        }
        Some(p) => p,
    };

    debug!(message = "下载文件", path = ?path);

    if !path.exists() {
        error!(message = "path 不存在", path = ?path);
        return Err(ServerError::new("文件不存在", "路径错误或该文件已被删除"));
    }

    let builder = NamedFile::builder(&path);

    let filename = path.file_name().unwrap().to_str().unwrap();

    builder
        .attached_name(filename)
        .send(req.headers(), res)
        .await;

    Ok(())
}

#[handler]
async fn files(res: &mut Response) -> Result<()> {
    let send_files_guard = SEND_FILES.read().await;

    let send_files = match send_files_guard.as_ref() {
        None => {
            error!("未选择文件");
            return Err(ServerError::new(
                "小路互传客户端未选择文件",
                "请先在小路互传选择一些文件",
            ));
        }
        Some(arr) => arr,
    };

    debug!(message = "发送的文件列表", files = ?send_files);

    res.render(Json(send_files));

    drop(send_files_guard);

    info!("文件列表已发送到客户端，清空文件列表");
    let mut send_files = SEND_FILES.write().await;
    *send_files = None;

    Ok(())
}

#[handler]
async fn upload(req: &mut Request) -> Result<()> {
    debug!(message = "收到上传任务", ip = ?req.remote_addr());

    let name = match req.query::<String>("name") {
        Some(s) => s,
        None => {
            error!("请求地址中未找到文件名");
            return Err(ServerError::new("文件名为空", "请通过小路互传扫码访问"));
        }
    };
    debug!(message = "接收的文件名", name = name);

    let size: u64 = match req.header("content-length") {
        Some(n) => n,
        None => {
            error!("请求头中未找到文件大小");

            return Err(ServerError::new("文件长度为空", "请通过小路互传扫码访问"));
        }
    };

    info!(
        message= "收到有效的上传任务",
        name = name,
        size = size,
        ip = ?req.remote_addr()
    );

    let start = Instant::now();

    let formatted_size = format_file_size(size);
    let path: PathBuf = DOWNLOADS_DIR.read().await.as_path().join(&name);

    let body = req.take_body();
    let stream = ReadProgressStream::new(
        body,
        Box::new({
            let name = name.clone();
            let formatted_size = formatted_size.clone();
            let path = path.clone();
            move |cost, progress| {
                let percent = (progress * 1000 / size) as f64 / 10.0;

                // 纳秒转为浮点数的秒
                let cost_senconds = cost.as_nanos() as f64 / 1000000000.0;

                // chunk_size 转为浮点数的 mb
                let progress = progress as f64 / (1024 * 1024) as f64;

                let speed = progress / cost_senconds;

                if let Some(w) = MAIN_WINDOW.get() {
                    let _ = w.emit(
                        UPLOAD_EVENT,
                        Task::new(&path, &name, &formatted_size, percent, speed, false),
                    );
                }
            }
        }),
    );

    let file_path = DOWNLOADS_DIR.read().await.join(&name);

    debug!(message = "保存的文件路径", path = ?file_path);

    let mut stream_reader = StreamReader::new(stream);
    let mut file = File::create(&file_path).await.map_err(|e| {
        error!(message = "新建文件时出错", path = ?file_path, error = ?e);
        ServerError::Internal
    })?;
    if let Err(e) = tokio::io::copy(&mut stream_reader, &mut file).await {
        error!(message = "复制文件流时出错", path = ?file_path, error = ?e);

        if let Some(w) = MAIN_WINDOW.get() {
            let _ = w.emit(
                UPLOAD_EVENT,
                Task::new(&path, &name, &formatted_size, 0., 0., true),
            );
        }

        // 上传未完成时删除本地未完成的文件
        fs::remove_file(&file_path).await.map_err(|e| {
            error!(message = "删除未完成文件时出错", path = ?file_path, error = ?e);
            ServerError::Internal
        })?;

        info!(message = "已删除未完成文件", path = ?file_path);

        return Err(ServerError::new("请求中断", None));
    }

    let end = Instant::now();

    info!(
        message = "已保存文件",
        path = ?file_path,
        size = size,
        ip = ?req.remote_addr(),
        cost = ?end.duration_since(start),
    );

    Ok(())
}

pub(super) async fn serve() -> AlleyResult<()> {
    // 程序启动时的默认下载目录
    let default_downloads_dir = DOWNLOADS_DIR.read().await;
    if !default_downloads_dir.exists() {
        debug!(message = "创建默认接收目录", dir = ?default_downloads_dir);
        fs::create_dir(default_downloads_dir.clone())
            .await
            .map_err(|e| {
                error!(message = "创建默认接收目录失败", error = ?e);
                e
            })?;
    }
    drop(default_downloads_dir);

    let mut router = Router::new()
        .hoop(Logger::new())
        .push(Router::with_path("connect").get(connect))
        .push(Router::with_path("files").get(files))
        .push(Router::with_path("download/<path>").get(download_file))
        .push(Router::with_path("upload").post(upload));

    #[cfg(debug_assertions)]
    {
        router = router.get(index);
    }

    #[cfg(not(debug_assertions))]
    {
        #[cfg(any(target_os = "windows", target_os = "macos"))]
        let static_dir = {
            let current_exe = env::current_exe().map_err(|e| {
                error!(message = "获取可执行文件路径失败", error = ?e);
                e
            })?;

            info!(message = "已获取到可执行文件路径", path = ?current_exe);

            let current_dir = current_exe.parent().unwrap().parent().unwrap();

            debug!(
                message = "当前工作目录",
                dir = ?current_dir,
                is_absolute = current_dir.is_absolute(),
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
            error!(message = "创建 TcpListener 失败", error = ?e);
            process::exit(1);
        }
    };
    Server::new(acceptor).serve(router).await;

    Ok(())
}
