// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod lazy;
mod logger;
mod server;

#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate simplelog;

use std::{
    path::Path,
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
use tauri::{api::shell::open, Manager};
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
    let map = QR_CODE_MAP.read().await;
    map.contains_key(&id)
}

#[tauri::command]
async fn local_ip_qr_code() -> AlleyResult<QrCode> {
    let ts = now()?.as_secs();

    let url = format!("http://{}:{}/connect?ts={}", LOCAL_IP.to_string(), 5800, ts);
    let code = qrcode_generator::to_svg_to_string(&url, QrCodeEcc::Low, 256, None::<&str>)?;

    Ok(QrCode {
        svg: code,
        url,
        id: ts,
    })
}

#[tauri::command]
async fn download_dir() -> &'static Path {
    &DOWNLOADS_DIR
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
            download_dir,
        ])
        .run(tauri::generate_context!())?;

    Ok(())
}
