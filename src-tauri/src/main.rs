// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod lazy;
mod logger;
mod server;

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
use logger::logger_config;
use qrcode_generator::QrCodeEcc;
use serde::Serialize;
use server::{DOWNLOADS_DIR, MAIN_WINDOW, QR_CODE_MAP};
#[cfg(debug_assertions)]
use simplelog::{ColorChoice, TermLogger, TerminalMode};
use tauri::Manager;
#[cfg(not(debug_assertions))]
use {lazy::APP_CONFIG_DIR, simplelog::WriteLogger, std::fs};

use crate::logger::log_level;

fn now() -> AlleyResult<Duration> {
    SystemTime::now().duration_since(UNIX_EPOCH).map_err(|e| {
        error!("获取时间出错: {}", e);
        e.into()
    })
}

#[derive(Serialize)]
struct QrCode {
    svg: String,
    url: String,
    id: u64,
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
async fn local_ip_qr_code() -> AlleyResult<QrCode> {
    trace!("获取 server 地址二维码");

    let ts = now()?.as_secs();

    trace!("获取时间戳: {}", ts);

    let url = format!("http://{}:{}/connect?ts={}", LOCAL_IP.to_string(), 5800, ts);

    debug!("二维码对应的 url: {}", url);

    let code = qrcode_generator::to_svg_to_string(&url, QrCodeEcc::Low, 256, None::<&str>)?;

    info!("已创建二维码");

    Ok(QrCode {
        svg: code,
        url,
        id: ts,
    })
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

    tauri::Builder::default()
        .setup(|app| {
            if let Some(w) = app.get_window("main") {
                MAIN_WINDOW.set(w).unwrap();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            local_ip_qr_code,
            get_qr_code_state,
            downloads_dir,
            change_downloads_dir,
        ])
        .run(tauri::generate_context!())?;

    Ok(())
}
