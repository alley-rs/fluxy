pub(super) fn format_file_size(size: u64) -> String {
    const KB: f64 = 1024.0;
    const MB: f64 = KB * 1024.0;
    const GB: f64 = MB * 1024.0;

    let size_f64 = size as f64;
    match size_f64 {
        _ if size_f64 < KB => format!("{} B", size),
        _ if size_f64 < MB => format!("{:.2} KB", size_f64 / KB),
        _ if size_f64 < GB => format!("{:.2} MB", size_f64 / MB),
        _ => format!("{:.2} GB", size_f64 / GB),
    }
}

pub(super) async fn calculate_sha1() {}
