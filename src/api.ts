import { invoke } from "@tauri-apps/api";

export const getDownloadDir = async () => await invoke<string>("download_dir");
