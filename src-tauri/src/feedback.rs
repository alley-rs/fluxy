use tokio::{
    fs::File,
    io::{AsyncReadExt, AsyncWriteExt},
};

use crate::{error::FluxyResult, lazy::APP_CONFIG_DIR};

#[tauri::command]
pub async fn get_star_state() -> FluxyResult<bool> {
    let file_path = APP_CONFIG_DIR.join("STAR");
    if !file_path.exists() || file_path.is_dir() {
        return Ok(false);
    }

    let mut file = File::open(file_path).await?;
    let mut buf = [0u8; 1];
    file.read_exact(&mut buf).await?;

    Ok(buf[0] == 1)
}

#[tauri::command]
pub async fn stared() -> FluxyResult<()> {
    let file_path = APP_CONFIG_DIR.join("STAR");
    let mut file = File::create(file_path).await?;
    file.write_all(&[1]).await?;

    Ok(())
}
