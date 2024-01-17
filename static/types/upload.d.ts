interface FileListItem {
  file: File;
  speed?: number;
  percent?: number;
}

interface UploadRequestError extends Error, ProgressEvent<EventTarget> {
  status?: number;
  method?: UploadRequestOption["method"];
  url?: string;
  name?: string;
  message?: string;
}

interface UploadProgressEvent extends ProgressEvent<EventTarget> {
  percent?: number;
  speed?: number;
}

interface UploadRequestOption extends FileListItem {
  action: string;
  method: "POST" | "PUT";
  onProgress: (e: UploadProgressEvent, file: File) => void;
  onError: (e: UploadRequestError, body?: object | string) => void;
  onSuccess: (body: object | string, xhr: XMLHttpRequest) => void;
  withCredentials?: boolean;
  headers?: Record<string, string>;
}
