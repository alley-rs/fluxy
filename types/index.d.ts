interface TaskMessage {
  name: string;
  percent: number;
  speed: number;
  size: string;
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
