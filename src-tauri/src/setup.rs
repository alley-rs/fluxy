use tauri::Manager;
use time::macros::{format_description, offset};
use tracing::Level;
use tracing_subscriber::fmt::time::OffsetTime;

use crate::MAIN_WINDOW;

pub fn setup_logging() {
    let fmt = if cfg!(debug_assertions) {
        format_description!("[hour]:[minute]:[second].[subsecond digits:3]")
    } else {
        format_description!("[year]-[month]-[day] [hour]:[minute]:[second].[subsecond digits:3]")
    };

    let timer = OffsetTime::new(offset!(+8), fmt);

    #[cfg(all(desktop, not(debug_assertions)))]
    let writer = {
        use crate::lazy::APP_CONFIG_DIR;
        use std::{fs::File, sync::Mutex};
        let log_file =
            File::create(APP_CONFIG_DIR.join("fluxy.log")).expect("Failed to create the log file");
        Mutex::new(log_file)
    };

    #[cfg(any(debug_assertions, mobile))]
    let writer = std::io::stderr;

    let builder = tracing_subscriber::fmt()
        .with_max_level(Level::TRACE)
        .with_file(true)
        .with_line_number(true)
        .with_env_filter("fluxy_lib")
        .with_target(false)
        .with_timer(timer)
        .with_writer(writer);

    if cfg!(debug_assertions) {
        builder.init();
    } else {
        builder.json().init();
    }
}

pub fn setup_app(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    info!(
        "Setting up application: version {}",
        app.package_info().version
    );

    #[cfg(desktop)]
    {
        app.handle()
            .plugin(tauri_plugin_updater::Builder::new().build())?;

        // NOTE: 下面三个插件未兼容手机，在兼容前不编译到手机端
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

    info!("Application setup completed");

    Ok(())
}
