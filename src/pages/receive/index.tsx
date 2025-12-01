import {
  createEffect,
  createSignal,
  For,
  Match,
  onCleanup,
  onMount,
  Switch,
} from "solid-js";

import { createStore } from "solid-js/store";

import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

import { getQrCodeState, getUploadQrCode } from "~/api";
import { LazyQrcode } from "~/lazy";
import Header from "./header";
import FileListItem from "./FileListItem";
import { tokens } from "~/themes/themes.css";

const appWindow = getCurrentWebviewWindow();

const ReceivePage = () => {
  const [qrcode, setQrcode] = createSignal<QrCode | null>(null);

  const [taskList, setTaskList] = createStore<TaskMessage[]>([]);
  const [fileList, setFileList] = createStore<Omit<TaskMessage, "speed">[]>([]);

  onMount(() => {
    if (qrcode() || taskList.length || fileList.length) return;

    getUploadQrCode().then((c) => setQrcode(c));
  });

  createEffect(() => {
    const unlisten = appWindow.listen<TaskMessage>("upload://progress", (e) => {
      if (qrcode()) setQrcode(null);

      const { path, percent, aborted } = e.payload;

      const taskIndex = taskList.findIndex((prev) => prev.path === path);
      if (taskIndex === -1) {
        setTaskList(taskList.length, e.payload);
      } else {
        setTaskList(taskIndex, (item) => ({
          ...item,
          percent: e.payload.percent,
          speed: e.payload.speed,
        }));
      }

      if (aborted) {
        setFileList((prev) => prev.filter((i) => i.path !== path));
        setTaskList((prev) => prev.filter((i) => i.path !== path));
        return;
      }

      if (percent === 100) {
        setTaskList((prev) => prev.filter((i) => i.path !== path));

        const doneIndex = fileList.findIndex((prev) => prev.path === path);
        if (doneIndex === -1) setFileList(fileList.length, e.payload);
      }
    });

    onCleanup(() => {
      unlisten.then((f) => f());
    });
  });

  createEffect(() => {
    const code = qrcode();
    if (!code) return;

    const timer = setInterval(async () => {
      const used = await getQrCodeState(code.id);

      if (used) {
        clearTimeout(timer);
        setQrcode(null);
      }
    }, 500);

    onCleanup(() => clearTimeout(timer));
  });

  return (
    <Switch>
      <Match when={qrcode() !== null}>
        <LazyQrcode qrcode={qrcode()!} />
      </Match>

      <Match when={qrcode() === null}>
        <div
          style={{
            flex: 1,
            padding: "16px",
            display: "flex",
            "flex-direction": "column",
            gap: tokens.spacing.md,
          }}
        >
          <Header />

          <div
            style={{
              flex: 10,
              display: "flex",
              "flex-direction": "column",
              gap: tokens.spacing.sm,
              "overflow-y": "auto",
            }}
          >
            <For each={fileList}>
              {(file, index) => (
                <FileListItem
                  path={file.path}
                  name={file.name}
                  size={file.size}
                  percent={100}
                  index={index()}
                />
              )}
            </For>

            <For each={taskList}>
              {(task) => (
                <FileListItem
                  path={task.path}
                  name={task.name}
                  size={task.size}
                  percent={task.percent}
                  speed={task.speed}
                />
              )}
            </For>
          </div>
        </div>
      </Match>
    </Switch>
  );
};

export default ReceivePage;
