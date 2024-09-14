use std::{fs, path::PathBuf};

use local_ip_address::local_ip;

lazy_static! {
    pub(super) static ref LOCAL_IP: String = local_ip().expect("获取本地ip失败").to_string();
    pub(super) static ref APP_CONFIG_DIR: PathBuf = {
        let config_dir = dirs::config_dir().unwrap();

        let app_config_dir = config_dir.join("fluxy");

        if !app_config_dir.exists() {
            fs::create_dir(&app_config_dir).unwrap();
        }

        app_config_dir
    };
}
