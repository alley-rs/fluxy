import { type JSX, createEffect, createSignal, createUniqueId } from "solid-js";
import { createStore } from "solid-js/store";
import { getFileItemIndex } from "./util";
import request from "./request";
import asyncPool from "~/components/upload/asyncPool";
import ErrorBlock from "../error-block";
import List from "../list";
import FileItem from "./fileItem";
import "./index.scss";
import Button from "../button";
import { AiOutlinePlus } from "solid-icons/ai";

interface UploadProps {
  action: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  method?: UploadRequestOption["method"];
}

const Upload = ({ action, headers, withCredentials, method }: UploadProps) => {
  let fileInput: HTMLInputElement | undefined;

  const [fileItems, setFileItems] = createStore<FileListItem[]>([]);

  const [requestTasks, setRequestTasks] = createSignal<RequestTask[]>([]);

  const appendTask = (task: RequestTask) =>
    setRequestTasks((pre) => [...pre, task]);

  const onProgress = (e: { percent?: number; speed?: number }, file: File) => {
    const idx = getFileItemIndex(file, fileItems);
    if (idx === -1) {
      return;
    }

    setFileItems(idx, () => ({ percent: e.percent, speed: e.speed }));
  };

  const onSuccess = (fileItem: FileListItem) => {
    const idx = getFileItemIndex(fileItem.file, fileItems);
    if (idx === -1) {
      return;
    }

    setFileItems(idx, () => ({ percent: 100, speed: undefined }));
  };

  const onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
    e,
  ) => {
    const { files } = e.target;

    if (!files) return;

    const fileItems: FileListItem[] = [];
    for (const file of files) {
      fileItems.push({ file, id: createUniqueId() });
    }

    for (const f of fileItems) {
      send(f);
    }

    setFileItems(fileItems);
  };

  const onClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (e) => {
    const target = e.target as HTMLElement;

    if (
      target &&
      (target.tagName === "BUTTON" ||
        target.parentElement?.tagName === "BUTTON" ||
        target.parentElement?.parentElement?.tagName === "BUTTON")
    ) {
      setFileItems([]);
      setRequestTasks([]);
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      fileInput!.value = ""; // 点击按钮后清空 input files
      fileInput?.click();
      target.blur();
    }
  };

  const send = (fileItem: FileListItem) => {
    const option: UploadRequestOption = {
      id: fileItem.id,
      action,
      file: fileItem.file,
      method: method || "POST",
      headers,
      withCredentials,
      onProgress,
      onError: (e) => {
        console.log(e);
        // todo: 反馈上传错误
      },
      onSuccess: () => {
        onSuccess(fileItem);
      },
    };

    request(option, appendTask);
  };

  createEffect(() => {
    // 任务数量与文件数量相等后才发送请求
    if (!fileItems.length || fileItems.length !== requestTasks().length) return;

    asyncPool(
      2, // 并发数量，应该根据实际场景判断，比如通过 fileList 中的文件尺寸进行判断，当超过某个阈值时减小并发量
      requestTasks(),
      (item) =>
        new Promise<void>((resolve) => {
          const xhr = item.xhr;

          item.done = resolve;
          item.start = new Date().getTime() / 1000;

          xhr.send(item.data);
        }),
    );
  });

  return (
    <div id="upload" onClick={onClick}>
      <div class="upload-file-list">
        {!fileItems.length ? (
          <div class="empty">
            <ErrorBlock
              status="empty"
              title="未选择文件"
              description="点击左上角的加号按钮选择文件"
            />
          </div>
        ) : (
          <List
            header="未完成的任务可点击右侧红色按钮中断"
            dataSource={fileItems}
            renderItem={(item, index) => (
              <FileItem
                index={index()}
                file={item.file}
                percent={item.percent}
                speed={item.speed}
                abort={() => {
                  // 中断请求
                  requestTasks()
                    .find((t) => t.id === item.id)
                    ?.xhr.abort();
                  // 删除文件
                  setFileItems((pre) => pre.filter((i) => i.id !== item.id));
                }}
              />
            )}
          />
        )}
      </div>
      <input
        type="file"
        multiple
        ref={fileInput}
        style={{ display: "none" }}
        onChange={onChange}
      />

      <Button
        class="submit-button"
        disabled={fileItems.findIndex((f) => f.speed !== undefined) >= 0}
      >
        <AiOutlinePlus />
      </Button>
    </div>
  );
};

export default Upload;
