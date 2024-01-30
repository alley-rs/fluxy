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

const upload = (
  option: UploadRequestOption,
  appendTask: (task: RequestTask) => void,
) => {
  const xhr = new XMLHttpRequest();

  const task: RequestTask = { id: option.id, xhr, data: option.file };

  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = function progress(e: UploadProgressEvent) {
      if (e.total! > 0) {
        e.percent = (e.loaded! / e.total!) * 100;

        const now = new Date().getTime() / 1000;
        const delta = now - task.start!;

        if (delta) e.speed = e.loaded! / 1024 / 1024 / delta;
        else e.speed = 0;
      }
      option.onProgress(e, option.file);
    };
  }

  xhr.onabort = () => {
    task.done!();
  };

  xhr.onerror = function error(e) {
    option.onError(e);
    task.done!();
  };

  xhr.onload = function onload() {
    // 代码执行到这里时 done 一定存在
    task.done!();

    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError!(getError(option, xhr), getBody(xhr));
    }

    return option.onSuccess(getBody(xhr), xhr);
  };

  xhr.open(option.method, option.action + "?name=" + option.file.name, true);

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

  appendTask(task);
};

export default upload;
