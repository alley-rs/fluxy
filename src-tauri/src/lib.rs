// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod lazy;
#[cfg(target_os = "linux")]
mod linux;
mod multicast;
mod server;
mod stream;

#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate tracing;

use std::{
    path::PathBuf,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use once_cell::sync::Lazy;
use qrcode_generator::QrCodeEcc;
use serde::Serialize;
use tauri::Manager;
use time::macros::{format_description, offset};
use tokio::{fs::File, sync::OnceCell};
use tracing::Level;
use tracing_subscriber::fmt::time::OffsetTime;

use crate::lazy::LOCAL_IP;
use crate::server::{SendFile, DOWNLOADS_DIR, MAIN_WINDOW, QR_CODE_MAP, SEND_FILES};
use crate::{error::AlleyResult, multicast::Multicast};

#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub use crate::lazy::APP_CONFIG_DIR;

static MULTICAST: Lazy<OnceCell<Multicast>> = Lazy::new(|| OnceCell::new());

async fn new_multicast() -> Multicast {
    Multicast::new(|message| {
        if let Some(w) = MAIN_WINDOW.get() {
            w.emit("multicast", message).unwrap();
        }
    })
    .await
    .unwrap()
}

async fn get_or_init_multicast() -> &'static Multicast {
    MULTICAST.get_or_init(new_multicast).await
}

fn now() -> AlleyResult<Duration> {
    SystemTime::now().duration_since(UNIX_EPOCH).map_err(|e| {
        error!(message = "获取时间出错", error = ?e);
        e.into()
    })
}

enum Mode {
    Send,
    Receive,
}

impl Mode {
    fn to_str(&self) -> &'static str {
        match self {
            Mode::Send => "send",
            Mode::Receive => "receive",
        }
    }
}

#[derive(Debug, Serialize)]
struct QrCode {
    svg: String,
    url: String,
    id: u64,
}

impl QrCode {
    fn new(mode: Mode) -> AlleyResult<Self> {
        let ts = now()?.as_secs();
        debug!(message = "获取到时间戳", ts = ts);

        let url = format!(
            "http://{}:{}/connect?mode={}&ts={}",
            LOCAL_IP.to_string(),
            5800,
            mode.to_str(),
            ts
        );
        debug!(message = "二维码信息", url = url);

        let code = qrcode_generator::to_svg_to_string(&url, QrCodeEcc::Low, 256, None::<&str>)
            .map_err(|e| {
                error!(message = "创建二维码失败", error = ?e);
                e
            })?;

        info!("已创建二维码");

        Ok(Self {
            svg: code,
            url,
            id: ts,
        })
    }
}

#[tauri::command]
async fn get_qr_code_state(id: u64) -> bool {
    trace!("获取 server 地址二维码状态");

    let map = QR_CODE_MAP.read().await;
    let state = map.contains_key(&id);

    info!(message = "server 地址二维码可用状态", state = !state);

    state
}

#[tauri::command]
async fn upload_qr_code() -> AlleyResult<QrCode> {
    trace!("获取上传地址二维码");

    let code = QrCode::new(Mode::Send)?;

    info!(
        message = "上传地址二维码已创建",
        url = code.url,
        svg = code.svg
    );

    Ok(code)
}

#[tauri::command]
async fn get_send_files_url_qr_code(files: Vec<SendFile>) -> AlleyResult<QrCode> {
    trace!("获取发送址二维码");
    let mut send_files = SEND_FILES.write().await;
    *send_files = Some(files);

    let code = QrCode::new(Mode::Receive)?;

    info!(
        message = "发送地址二维码已创建",
        url = code.url,
        svg = code.svg
    );

    Ok(code)
}

#[tauri::command]
async fn downloads_dir() -> PathBuf {
    trace!("获取下载目录");

    let path = DOWNLOADS_DIR.read().await.to_path_buf();

    info!(message = "当前下载目录为", dir = ?path);

    path
}

#[tauri::command]
async fn change_downloads_dir(path: PathBuf) {
    trace!("修改下载目录");

    let mut downloads_dir = DOWNLOADS_DIR.write().await;
    *downloads_dir = path.clone();

    info!(message = "下载目录已修改", dir = ?path);
}

#[tauri::command]
async fn get_files_metadata(paths: Vec<PathBuf>) -> AlleyResult<Vec<SendFile>> {
    trace!("获取待发送文件信息");
    let mut files = Vec::with_capacity(paths.len());

    for path in paths.iter() {
        if path.is_dir() {
            continue;
        }

        let filename = path.file_name().unwrap().to_str().unwrap();
        let extension = path.extension().unwrap().to_str().unwrap();
        let file = File::open(path).await.map_err(|e| {
            error!(message = "打开文件失败", path = ?path, error = ?e);
            e
        })?;
        let size = file
            .metadata()
            .await
            .map_err(|e| {
                error!(message = "获取文件元信息失败", path = ?path, error = ?e);
                e
            })?
            .len();

        files.push(SendFile::new(filename, path, extension, size))
    }

    info!("所有待发送文件信息: {:?}", files);

    Ok(files)
}

#[tauri::command]
fn is_linux() -> bool {
    cfg!(target_os = "linux")
}

#[tauri::command]
async fn init_multicast() {
    let multicast = get_or_init_multicast().await;

    multicast.listen();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(debug_assertions)]
    let fmt = format_description!("[hour]:[minute]:[second].[subsecond digits:3]");
    #[cfg(not(debug_assertions))]
    let fmt =
        format_description!("[year]-[month]-[day] [hour]:[minute]:[second].[subsecond digits:3]");

    let timer = OffsetTime::new(offset!(+8), fmt);

    #[cfg(all(desktop, not(debug_assertions)))]
    // NOTE: _guard must be a top-level variable
    let (writer, _guard) = {
        let file_appender = tracing_appender::rolling::never(&*APP_CONFIG_DIR, "alley.log");
        tracing_appender::non_blocking(file_appender)
    };

    #[cfg(any(debug_assertions, mobile))]
    let writer = std::io::stderr;

    let builder = tracing_subscriber::fmt()
        .with_max_level(Level::TRACE)
        .with_file(true)
        .with_line_number(true)
        .with_env_filter("app_lib,salvo_core::server")
        .with_timer(timer)
        .with_writer(writer);

    #[cfg(any(debug_assertions, mobile))]
    builder.init();

    #[cfg(all(not(debug_assertions), desktop))]
    builder.json().init();

    #[cfg(target_os = "linux")]
    {
        let scale_factor = crate::linux::get_scale_factor()?;
        if scale_factor.fract() != 0.0 {
            info!(message = "当前显示器非整数倍缩放", factor = scale_factor);
            std::env::set_var("GDK_SCALE", "2");
            std::env::set_var("GDK_DPI_SCALE", "0.5");
            info!("已为当前程序设置 GDK 缩放比例");
        }
    }

    tauri::async_runtime::spawn(server::serve());

    info!("已创建 serve 线程");

    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            #[cfg(desktop)]
            {
                app.handle()
                    .plugin(tauri_plugin_updater::Builder::new().build())?;

                // 下面三个插件未兼容手机，在兼容前不编译到手机端
                app.handle()
                    .plugin(tauri_plugin_clipboard_manager::init())?;
                app.handle().plugin(tauri_plugin_dialog::init())?;
                app.handle().plugin(tauri_plugin_shell::init())?;
            }

            #[cfg(target_os = "android")]
            {
                app.handle().plugin(file_picker_android::init())?;
                app.handle().plugin(tauri_plugin_barcode_scanner::init())?;
            }
            let main_window = app.handle().get_webview_window("main");
            if let Some(w) = main_window {
                if let Err(_) = MAIN_WINDOW.set(w) {
                    error!(message = "设置主窗口失败");
                    app.handle().exit(1);
                }
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            upload_qr_code,
            get_qr_code_state,
            downloads_dir,
            change_downloads_dir,
            get_files_metadata,
            get_send_files_url_qr_code,
            is_linux,
            init_multicast,
        ])
        .run(tauri::generate_context!())
        .map_err(|e| {
            error!(message = "创建 app 失败", error = ?e);
            e
        })
        .unwrap();
}
