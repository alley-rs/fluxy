use std::{env, process::Command};

use crate::error::AlleyResult;

pub(super) fn get_scale_factor() -> AlleyResult<f64> {
    let desktop_session = env::var("DESKTOP_SESSION")?;

    match desktop_session.as_str() {
        "deepin" => {
            let output = Command::new("gsettings")
                .args(["get", "com.deepin.xsettings", "scale-factor"])
                .output()?;

            let s = String::from_utf8(output.stdout).unwrap();

            Ok(s.trim().parse().unwrap())
        }
        _ => Ok(1.0),
    }
}
