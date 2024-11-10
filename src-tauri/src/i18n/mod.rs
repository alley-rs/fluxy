use std::{collections::HashMap, sync::LazyLock};

use serde::Serialize;

mod en_us;
mod zh_cn;

pub static LOCALES: LazyLock<HashMap<&'static Locale, &Translations>> = LazyLock::new(|| {
    [(&Locale::ZhCN, zh_cn::ZH_CN), (&Locale::EnUS, en_us::EN_US)]
        .iter()
        .copied()
        .collect()
});

#[derive(PartialEq, Eq, Hash)]
pub enum Locale {
    ZhCN,
    EnUS,
}

impl From<String> for Locale {
    fn from(value: String) -> Self {
        match value.as_ref() {
            "zh-CNa" => Self::ZhCN,
            _ => Self::EnUS,
        }
    }
}

#[derive(PartialEq, Eq, Hash, Serialize)]
pub struct Translations {
    pub window_title: &'static str,
    pub dark_mode_tooltip: &'static str,
    pub light_mode_tooltip: &'static str,
    pub about_button_tooltip: &'static str,
    pub about_dialog_github_tooltip: &'static str,
    pub about_dialog_feedback_tooltip: &'static str,
    pub home_label_text: &'static str,
    pub home_button_text: &'static str,
    pub home_send_button_text: &'static str,
    pub home_receive_button_text: &'static str,
    pub qrcode_page_title: &'static str,
    pub qrcode_page_url_label: &'static str,
    pub qrcode_page_url_tooltip: &'static str,
    pub qrcode_page_url_copied_message: &'static str,
    pub qrcode_page_toast_message: &'static str,
    pub ok_button_text: &'static str,
    pub clear_button_text: &'static str,
    pub send_page_title: &'static str,
    pub send_page_empty_drop_description: &'static str,
    pub send_page_drop_description: &'static str,
    pub list_item_file_size_label: &'static str,
    pub list_item_file_type_label: &'static str,
    pub send_page_list_item_tooltip: &'static str,
    pub receive_page_empty_description: &'static str,
    pub receive_page_list_item_tooltip: &'static str,
    pub receive_page_dropdown_open_button_label: &'static str,
    pub receive_page_dropdown_pick_button_label: &'static str,
    pub receive_page_directory_path_label: &'static str,
    pub receive_page_directory_path_tooltip: &'static str,
}
