import type { UploadProps } from "antd";
import { RcFile } from "antd/es/upload";

type UploadRequestOption = Parameters<
  NonNullable<UploadProps["customRequest"]>
>[0];

type UploadProgressEvent = Parameters<
  NonNullable<UploadRequestOption["onProgress"]>
>[0];

interface UploadRequestError extends Error {
  status: number;
  method: UploadRequestOption["method"];
  url: string;
}

function getError(option: UploadRequestOption, xhr: XMLHttpRequest) {
  const msg = `cannot ${option.method} ${option.action} ${xhr.status}'`;
  const err = new Error(msg) as UploadRequestError;
  err.status = xhr.status;
  err.method = option.method;
  err.url = option.action;
  return err;
}

function getBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

const upload = (option: UploadRequestOption) => {
  // eslint-disable-next-line no-undef
  const xhr = new XMLHttpRequest();

  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = function progress(e: UploadProgressEvent) {
      if (e.total! > 0) {
        e.percent = (e.loaded! / e.total!) * 100;
      }
      option.onProgress!(e);
    };
  }

  xhr.onerror = function error(e) {
    option.onError!(e);
  };

  xhr.onload = function onload() {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError!(getError(option, xhr), getBody(xhr));
    }

    return option.onSuccess!(getBody(xhr), xhr);
  };

  xhr.open(
    option.method,
    option.action + "?name=" + (option.file as RcFile).name,
    true,
  );

  // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
  if (option.withCredentials && "withCredentials" in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  // when set headers['X-Requested-With'] = null , can close default XHR header
  // see https://github.com/react-component/upload/issues/33
  if (headers["X-Requested-With"] !== null) {
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  }

  Object.keys(headers).forEach((h) => {
    if (headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h]);
    }
  });

  // 上传文件流,而非 FormData
  xhr.send(option.file);

  return {
    abort() {
      xhr.abort();
    },
  };
};

export default upload;
