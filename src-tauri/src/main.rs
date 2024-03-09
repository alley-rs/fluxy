// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod lazy;
#[cfg(target_os = "linux")]
mod linux;
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

use qrcode_generator::QrCodeEcc;
use serde::Serialize;
use tauri::{Manager, UpdaterEvent};
use time::macros::{format_description, offset};
use tokio::fs::File;
use tracing::Level;
use tracing_subscriber::fmt::time::OffsetTime;

use crate::lazy::LOCAL_IP;
use crate::server::{SendFile, DOWNLOADS_DIR, MAIN_WINDOW, QR_CODE_MAP, SEND_FILES};
use crate::{error::AlleyResult, lazy::APP_CONFIG_DIR};

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

#[tokio::main]
async fn main() -> AlleyResult<()> {
    #[cfg(debug_assertions)]
    let timer = OffsetTime::new(
        offset!(+8),
        format_description!("[hour]:[minute]:[second].[subsecond digits:3]"),
    );
    #[cfg(not(debug_assertions))]
    let timer = OffsetTime::new(
        offset!(+8),
        format_description!("[year]-[month]-[day] [hour]:[minute]:[second].[subsecond digits:3]"),
    );

    // NOTE: _guard must be a top-level variable
    let (writer, _guard) = {
        let file_appender = tracing_appender::rolling::never(&*APP_CONFIG_DIR, "alley.log");
        tracing_appender::non_blocking(file_appender)
    };

    #[cfg(debug_assertions)]
    let writer = {
        use tracing_subscriber::fmt::writer::MakeWriterExt;
        std::io::stderr.and(writer)
    };

    let builder = tracing_subscriber::fmt()
        .with_max_level(Level::TRACE)
        .with_file(true)
        .with_line_number(true)
        .with_env_filter("alley")
        .with_timer(timer)
        .with_writer(writer);

    #[cfg(debug_assertions)]
    builder.init();

    #[cfg(not(debug_assertions))]
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

    tokio::spawn(server::serve());
    info!("已创建 serve 线程");

    let app = tauri::Builder::default()
        .setup(|app| {
            if let Some(w) = app.get_window("main") {
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
        ])
        .build(tauri::generate_context!())
        .map_err(|e| {
            error!(message = "创建 app 失败", error = ?e);
            e
        })?;

    app.run(|_app_handle, event| match event {
        tauri::RunEvent::Updater(e) => match e {
            UpdaterEvent::UpdateAvailable {
                body,
                date,
                version,
            } => {
                info!(message = "版本有更新", body = body, date = ?date, version = version);
            }
            UpdaterEvent::Pending => {
                info!("准备下载新版本");
            }
            UpdaterEvent::DownloadProgress {
                chunk_length,
                content_length,
            } => {
                trace!("正在下载: {}/{:?}", chunk_length, content_length);
            }
            UpdaterEvent::Downloaded => {
                info!("新版本已下载");
            }
            UpdaterEvent::Updated => {
                info!("更新完成");
            }
            UpdaterEvent::AlreadyUpToDate => {
                info!("当前已是最新版本");
            }
            UpdaterEvent::Error(e) => {
                error!(message = "更新失败", error = e);
            }
        },
        _ => {}
    });

    Ok(())
}
