#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use time::macros::{format_description, offset};
use tracing::Level;
use tracing_subscriber::fmt::time::OffsetTime;

fn main() {
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

    #[cfg(not(any(target_os = "android", target_os = "ios")))]
    // NOTE: _guard must be a top-level variable
    let (writer, _guard) = {
        let file_appender =
            tracing_appender::rolling::never(&*app_lib::APP_CONFIG_DIR, "alley.log");
        tracing_appender::non_blocking(file_appender)
    };

    #[cfg(debug_assertions)]
    let writer = {
        #[cfg(not(any(target_os = "android", target_os = "ios")))]
        {
            use tracing_subscriber::fmt::writer::MakeWriterExt;
            std::io::stderr.and(writer)
        }
        #[cfg(any(target_os = "android", target_os = "ios"))]
        std::io::stderr
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

    app_lib::run().unwrap();
}
