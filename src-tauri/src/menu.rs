use tauri::{
    api::shell::open, AboutMetadata, CustomMenuItem, Manager, Menu, MenuItem, Submenu, Window,
};

pub(super) fn new_menu() -> Menu {
    let issue = CustomMenuItem::new("issue".to_string(), "反馈");
    let website = CustomMenuItem::new("website".to_string(), "官网");

    let menu = Menu::new()
        .add_item(website)
        .add_item(issue)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::About("".to_owned(), AboutMetadata::new()));

    let submenu = Submenu::new("fluxy", menu);

    Menu::new().add_submenu(submenu)
}

pub(super) fn handle_menu_event<R: tauri::Runtime>(window: &Window<R>, id: &str) {
    match id {
        "website" => open(
            &window.shell_scope(),
            "https://github.com/alley-rs/fluxy",
            None,
        )
        .unwrap(),
        "issue" => open(
            &window.shell_scope(),
            "https://github.com/alley-rs/fluxy/issues",
            None,
        )
        .unwrap(),
        _ => unreachable!(),
    }
}
