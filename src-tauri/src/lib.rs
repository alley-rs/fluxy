// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod lazy;
#[cfg(target_os = "linux")]
mod linux;
mod multicast;
mod peer;
mod stream;

#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate tracing;

use std::sync::OnceLock;

use once_cell::sync::Lazy;
use tauri::{Emitter, Manager, WebviewWindow};
use time::macros::{format_description, offset};
use tokio::sync::{OnceCell, RwLock};
use tracing::Level;
use tracing_subscriber::fmt::time::OffsetTime;

use crate::multicast::Multicast;
use crate::peer::Peer;

#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub use crate::lazy::APP_CONFIG_DIR;

static MULTICAST: Lazy<OnceCell<Multicast>> = Lazy::new(OnceCell::new);

lazy_static! {
    static ref LISTENER: RwLock<Option<Peer>> = RwLock::new(None);
}

pub static MAIN_WINDOW: OnceLock<WebviewWindow> = OnceLock::new();

async fn new_multicast() -> Multicast {
    Multicast::new(
        |message| {
            if let Some(w) = MAIN_WINDOW.get() {
                w.emit("multicast:message", message).unwrap();
            }
        },
        |event| {
            if let Some(w) = MAIN_WINDOW.get() {
                w.emit("multicast:receive-event", event).unwrap();
            }
        },
    )
    .await
    .unwrap()
}

async fn get_or_init_multicast() -> &'static Multicast {
    MULTICAST.get_or_init(new_multicast).await
}

//async fn new_listener() -> Listener {
//    Listener::new().await.unwrap()
//}
//
//async fn get_or_init_listener() -> &'static Listener {
//    LISTENER.get_mut_or_init(new_listener).await
//}

// fn now() -> AlleyResult<Duration> {
//     SystemTime::now().duration_since(UNIX_EPOCH).map_err(|e| {
//         error!(message = "获取时间出错", error = ?e);
//         e.into()
//     })
// }

#[tauri::command]
fn is_linux() -> bool {
    cfg!(target_os = "linux")
}

#[tauri::command]
async fn init_multicast() {
    let multicast = get_or_init_multicast().await;

    multicast.listen();
}

//#[tauri::command]
//async fn init_listener(window: tauri::WebviewWindow) -> AlleyResult<MessageState> {
//    let mut l = LISTENER.write().await;
//    if l.is_some() {
//        return Err(AlleyError::ListenerInitialized);
//    }
//
//    let mut peer = Peer::new().await?;
//    let msg = peer.handle_recieve(&window).await?;
//
//    *l = Some(peer);
//
//    Ok(msg)
//}

//#[tauri::command]
//async fn handle_pair_response(response: String) {
//    let listener = LISTENER.write().await;
//
//    if let Some(l) = listener.as_ref() {
//        l.set_pair_response(response.try_into().unwrap()).await;
//    }
//}

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

    // tauri::async_runtime::spawn(server::serve());
    // info!("已创建 serve 线程");

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
                app.handle().plugin(tauri_plugin_barcode_scanner::init())?;
            }
            let main_window = app.handle().get_webview_window("main");
            if let Some(w) = main_window {
                if MAIN_WINDOW.set(w).is_err() {
                    error!(message = "设置主窗口失败");
                    app.handle().exit(1);
                }
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            is_linux,
            init_multicast,
            //init_listener,
            //handle_pair_response,
        ])
        .run(tauri::generate_context!())
        .map_err(|e| {
            error!(message = "创建 app 失败", error = ?e);
            e
        })
        .unwrap();
}
