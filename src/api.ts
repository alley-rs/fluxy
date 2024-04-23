import { invoke } from "@tauri-apps/api/core";

export const getDownloadsDir = async () =>
  await invoke<string>("downloads_dir");

export const changeDownloadsDir = async (path: string) =>
  await invoke<void>("change_downloads_dir", { path });

export const getQrCodeState = async (id: number) =>
  await invoke<boolean>("get_qr_code_state", {
    id,
  });

export const getUploadQrCode = async () =>
  await invoke<QrCode>("upload_qr_code");

export const pickFileServerDirectory = async (path: string) =>
  await invoke<string[]>("pick_file_server_directory", { path });

export const getFilesMetadata = async (paths: string[]) =>
  await invoke<SendFile[]>("get_files_metadata", { paths });

export const getSendFilesUrlQrCode = async (files: SendFile[]) =>
  await invoke<QrCode>("get_send_files_url_qr_code", { files });

export const isLinux = async () => await invoke<boolean>("is_linux");
