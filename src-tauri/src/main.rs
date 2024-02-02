// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod lazy;
mod logger;
mod server;
mod stream;

#[macro_use]
extern crate lazy_static;
#[cfg(debug_assertions)]
#[macro_use]
extern crate simplelog;
#[cfg(not(debug_assertions))]
#[macro_use]
extern crate log;

use std::{
    path::PathBuf,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use error::AlleyResult;
use lazy::LOCAL_IP;
use log::info;
use logger::logger_config;
use qrcode_generator::QrCodeEcc;
use serde::Serialize;
use server::{SendFile, DOWNLOADS_DIR, MAIN_WINDOW, QR_CODE_MAP};
#[cfg(debug_assertions)]
use simplelog::{ColorChoice, TermLogger, TerminalMode};
use tauri::{Manager, UpdaterEvent};
use tokio::fs::File;
#[cfg(not(debug_assertions))]
use {lazy::APP_CONFIG_DIR, simplelog::WriteLogger, std::fs};

use crate::{logger::log_level, server::SEND_FILES};

fn now() -> AlleyResult<Duration> {
    SystemTime::now().duration_since(UNIX_EPOCH).map_err(|e| {
        error!("获取时间出错: {}", e);
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
        trace!("获取时间戳: {}", ts);

        let url = format!(
            "http://{}:{}/connect?mode={}&ts={}",
            LOCAL_IP.to_string(),
            5800,
            mode.to_str(),
            ts
        );
        debug!("二维码对应的 url: {}", url);

        let code = qrcode_generator::to_svg_to_string(&url, QrCodeEcc::Low, 256, None::<&str>)?;

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

    info!("server 地址二维码可用状态: {}", !state);

    state
}

#[tauri::command]
async fn upload_qr_code() -> AlleyResult<QrCode> {
    trace!("获取上传地址二维码");

    let code = QrCode::new(Mode::Send)?;

    info!("上传地址二维码已创建: {:?}", code);

    Ok(code)
}

#[tauri::command]
async fn get_send_files_url_qr_code(files: Vec<SendFile>) -> AlleyResult<QrCode> {
    trace!("获取发送址二维码");
    let mut send_files = SEND_FILES.write().await;
    *send_files = Some(files);

    let code = QrCode::new(Mode::Receive)?;

    info!("发送地址二维码已创建: {:?}", code);

    Ok(code)
}

#[tauri::command]
async fn downloads_dir() -> PathBuf {
    trace!("获取下载目录");

    let path = DOWNLOADS_DIR.read().await.to_path_buf();

    info!("当前下载目录为: {:?}", path);

    path
}

#[tauri::command]
async fn change_downloads_dir(path: PathBuf) {
    trace!("修改下载目录");

    let mut downloads_dir = DOWNLOADS_DIR.write().await;
    *downloads_dir = path.clone();

    info!("下载目录已改为: {:?}", path);
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
        let file = File::open(path).await?;
        let size = file.metadata().await?.len();

        files.push(SendFile::new(filename, path, extension, size))
    }

    info!("所有待发送文件信息: {:?}", files);

    Ok(files)
}

#[tokio::main]
async fn main() -> AlleyResult<()> {
    #[cfg(debug_assertions)]
    TermLogger::init(
        log_level(),
        logger_config(true),
        TerminalMode::Mixed,
        ColorChoice::Auto,
    )?;
    #[cfg(not(debug_assertions))]
    WriteLogger::init(
        log_level(),
        logger_config(true),
        fs::File::create(APP_CONFIG_DIR.join("alley.log"))?,
    )?;

    tokio::spawn(server::serve());
    info!("已创建 serve 线程");

    let app = tauri::Builder::default()
        .setup(|app| {
            if let Some(w) = app.get_window("main") {
                MAIN_WINDOW.set(w).unwrap();
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
        ])
        .build(tauri::generate_context!())?;

    app.run(|_app_handle, event| match event {
        tauri::RunEvent::Updater(e) => match e {
            UpdaterEvent::UpdateAvailable {
                body,
                date,
                version,
            } => {
                info!("版本有更新: {} {:?} {}", body, date, version);
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
            UpdaterEvent::Error(error) => {
                error!("更新失败: {}", error);
            }
        },
        _ => {}
    });

    Ok(())
}
