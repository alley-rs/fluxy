use std::path::Path;

use serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub(super) struct Task<'a> {
    path: &'a Path,
    name: &'a str,
    percent: f64,
    speed: f64, // MB/s
    size: &'a str,
    aborted: bool,
}

impl<'a> Task<'a> {
    pub(super) fn new(
        path: &'a Path,
        name: &'a str,
        size: &'a str,
        percent: f64,
        speed: f64,
        aborted: bool,
    ) -> Self {
        Self {
            path,
            name,
            percent,
            speed,
            size,
            aborted,
        }
    }
}
