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

type OsType = "Android" | "Windows" | "Macos";
