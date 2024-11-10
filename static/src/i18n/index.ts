import EN_US from "./en_us";
import ZH_CN from "./zh_cn";

export interface Locale {
  invalid_request: string;
  mode_is_required: string;

  file_item_file_size_label: string;
  file_item_file_type_label: string;

  send_page_title: string;
  send_page_empty_title: string;
  send_page_empty_description: string;
  send_page_uploading_tooltip: string;

  receive_page_title: string;
  receive_page_toast: string;
  receive_page_file_list_header: string;
}

export const getLocale = (): Locale => {
  const language = navigator.language;

  if (language === "zh-CN") {
    return ZH_CN;
  }

  return EN_US;
};
