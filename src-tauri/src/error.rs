use std::time::SystemTimeError;

use qrcode_generator::QRCodeError;
use serde::{Serialize, Serializer};

#[derive(Debug, thiserror::Error)]
pub enum AlleyError {
    // #[error(transparent)]
    // SetLogger(#[from] SetLoggerError),
    #[error(transparent)]
    SystemTime(#[from] SystemTimeError),
    #[error(transparent)]
    Tauro(#[from] tauri::Error),
    #[error(transparent)]
    QRCode(#[from] QRCodeError),
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[cfg(target_os = "linux")]
    #[error(transparent)]
    EnvVar(#[from] std::env::VarError),
}

impl Serialize for AlleyError {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub(crate) type AlleyResult<T> = Result<T, AlleyError>;
