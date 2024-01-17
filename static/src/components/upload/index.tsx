import { useEffect, useRef, useState } from "react";
import { Button, ErrorBlock } from "antd-mobile";
import "./index.scss";
import FileItem from "./fileItem";
import { getFileItem, updateFileList } from "./util";
import request from "./request";
import asyncPool from "~/components/upload/asyncPool";

interface UploadProps {
  action: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  method?: UploadRequestOption["method"];
}

const Upload = ({ action, headers, withCredentials, method }: UploadProps) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [fileItems, setFileItems] = useState<FileListItem[]>([]);

  const [requestTasks, setRequestTasks] = useState<RequestTask[]>([]);

  const appendTask = (task: RequestTask) =>
    setRequestTasks((pre) => [...pre, task]);

  const onProgress = (e: { percent?: number; speed?: number }, file: File) => {
    // removed
    if (!getFileItem(file, fileItems)) {
      return;
    }

    const item: FileListItem = {
      file,
      percent: e.percent,
      speed: e.speed,
    };

    setFileItems((pre) => updateFileList(item, pre));
  };

  const onSuccess = (fileItem: FileListItem) => {
    // removed
    if (!getFileItem(fileItem.file, fileItems)) {
      return;
    }

    const item: FileListItem = {
      ...fileItem,
      percent: 100,
    };

    setFileItems((pre) => updateFileList(item, pre));
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target && target.tagName === "BUTTON") {
      fileInput.current?.click();
      target.blur();
    }
  };

  const send = (fileItem: FileListItem) => {
    const option: UploadRequestOption = {
      action,
      file: fileItem.file,
      method: method || "POST",
      headers,
      withCredentials,
      onProgress,
      onError: function (): void {
        // todo: 反馈上传错误
      },
      onSuccess: () => {
        onSuccess(fileItem);
      },
    };

    request(option, appendTask);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files) return;

    const fileItems: FileListItem[] = [];
    for (const file of files) {
      fileItems.push({ file });
    }

    setFileItems(fileItems);
  };

  useEffect(() => {
    fileItems.forEach((item) => send(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileItems.length]);

  useEffect(() => {
    asyncPool(
      2, // 并发数量，应该根据实际场景判断，比如通过 fileList 中的文件尺寸进行判断，当超过某个阈值时减小并发量
      requestTasks,
      (item) =>
        new Promise<void>((resolve) => {
          const xhr = item.xhr;

          item.done = resolve;
          item.start = Math.round(new Date().getTime() / 1000);

          xhr.send(item.data);
        })
    );
  }, [requestTasks]);

  return (
    <div id="upload" onClick={onClick}>
      <div className={"upload-file-list"}>
        {!fileItems?.length ? (
          <div className="empty">
            <ErrorBlock
              status="empty"
              title="未选择文件"
              description="点击最下面的按钮选择文件"
            />
          </div>
        ) : (
          fileItems.map((item, index) => (
            <FileItem
              key={index}
              file={item.file}
              percent={item.percent}
              speed={item.speed}
            />
          ))
        )}
      </div>
      <input
        type="file"
        multiple
        ref={fileInput}
        style={{ display: "none" }}
        onChange={onChange}
      />
      <Button block className="submit-button">
        选择文件
      </Button>
    </div>
  );
};

export default Upload;
