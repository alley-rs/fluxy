import { invoke } from "@tauri-apps/api";

export const getDownloadsDir = async () =>
  await invoke<string>("downloads_dir");

export const changeDownloadsDir = async (path: string) =>
  await invoke<void>("change_downloads_dir", { path });

export const getQrCodeState = async (id: number) =>
  await invoke<boolean>("get_qr_code_state", {
    id,
  });

export const getLocalIPQrCode = async () =>
  await invoke<QrCode>("local_ip_qr_code");
