use std::{env, process::Command};

use crate::error::AlleyResult;

pub(super) fn get_scale_factor() -> AlleyResult<f64> {
    let desktop_session = env::var("DESKTOP_SESSION").map_err(|e| {
        error!(message = "从环境变量中获取桌面会话失败", error = ?e);
        e
    })?;

    info!(message = "已获取当前桌面会话", desktop = desktop_session);

    match desktop_session.as_str() {
        "deepin" => {
            let output = Command::new("gsettings")
                .args(["get", "com.deepin.xsettings", "scale-factor"])
                .output()
                .map_err(|e| {
                    error!(message = "获取桌面缩放比例失败", error = ?e);
                    e
                })?;

            let s = String::from_utf8(output.stdout).unwrap();

            Ok(s.trim().parse().unwrap())
        }
        _ => Ok(1.0),
    }
}
