// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod lazy;
#[cfg(target_os = "linux")]
mod linux;
mod multicast;
mod peer;
mod setup;
//mod stream;

#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate tracing;

use std::sync::OnceLock;

use once_cell::sync::Lazy;
use tauri::{Emitter, WebviewWindow};
use tokio::sync::{OnceCell, RwLock};

use crate::multicast::Multicast;
use crate::peer::Peer;
use crate::setup::{setup_app, setup_logging};

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
    setup_logging();

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

    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .setup(setup_app)
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
        .expect("Error while running tauri application");
}
