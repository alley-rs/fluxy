interface TaskMessage {
  path: string;
  name: string;
  percent: number;
  speed: number;
  size: string;
  aborted: boolean;
}

interface QrCode {
  svg: string;
  url: string;
  id: number;
}

interface SendFile {
  name: string;
  path: string;
  extension: string;
  size: string;
}

type CSSProperties = JSX.CSSProperties;

interface Translations {
  window_title: string;
  dark_mode_tooltip: string;
  light_mode_tooltip: string;
  about_button_tooltip: string;
  about_dialog_github_tooltip: string;
  about_dialog_feedback_tooltip: string;
  home_label_text: string;
  home_button_text: string;
  home_send_button_text: string;
  home_receive_button_text: string;
  qrcode_page_title: string;
  qrcode_page_url_label: string;
  qrcode_page_url_tooltip: string;
  qrcode_page_url_copied_message: string;
  qrcode_page_toast_message: string;
  ok_button_text: string;
  clear_button_text: string;
  send_page_title: string;
  send_page_empty_drop_description: string;
  send_page_drop_description: string;
  list_item_file_size_label: string;
  list_item_file_type_label: string;
  send_page_list_item_tooltip: string;
  receive_page_empty_description: string;
  receive_page_list_item_tooltip: string;
  receive_page_dropdown_open_button_label: string;
  receive_page_dropdown_pick_button_label: string;
  receive_page_directory_path_label: string;
  receive_page_directory_path_tooltip: string;
}
