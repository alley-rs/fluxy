interface TaskMessage {
  name: string;
  percent: number;
  speed: number;
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
