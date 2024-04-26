import {
  Match,
  Switch,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { getCurrent } from "@tauri-apps/api/webviewWindow";
import { getUploadQrCode, getQrCodeState } from "~/api";
import FileListItem from "./fileListItem";
import "./index.scss";
import { suspense } from "~/advance";
import {
  LazyReceiveHeader,
  LazyFloatButton,
  LazyFlex,
  LazyEmpty,
  LazyQrcode,
  LazyList,
  LazyFloatButtonGroup,
  LazyToast,
} from "~/lazy";
import { TbHome } from "solid-icons/tb";
import { createStore } from "solid-js/store";
import { AiFillDelete } from "solid-icons/ai";

interface ReceiveProps {
  toHome: () => void;
}

const appWindow = getCurrent();

const Receive = ({ toHome }: ReceiveProps) => {
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

  const floatButtons = () =>
    suspense(
      <LazyFloatButtonGroup>
        <Show when={fileList.length}>
          <LazyFloatButton
            tooltip="清空已完成列表"
            icon={<AiFillDelete />}
            onClick={() => setFileList([])}
            danger
          />
        </Show>

        <LazyFloatButton
          tooltip="回到主页"
          icon={<TbHome />}
          onClick={() => {
            setTaskList([]);
            setFileList([]);
            toHome();
          }}
        />
      </LazyFloatButtonGroup>,
    );

  return (
    <Switch>
      <Match when={qrcode() !== null}>
        <LazyQrcode qrcode={qrcode()!} />

        <LazyToast
          placement="top"
          open={true}
          message="请使用手机扫描此二维码"
          onClose={() => { }}
        />

        {floatButtons()}
      </Match>
      <Match when={!taskList.length && !fileList.length}>
        <LazyFlex
          direction="vertical"
          align="center"
          style={{ height: "100vh", padding: 0 }}
        >
          {suspense(<LazyReceiveHeader />)}
          <LazyFlex
            class="receive-file-list-empty"
            flex={8}
            align="center"
            justify="center"
          >
            <LazyEmpty description="请在手机端上传文件" />
          </LazyFlex>
        </LazyFlex>

        {floatButtons()}
      </Match>
      <Match when={qrcode() === null && (taskList.length || fileList.length)}>
        <LazyFlex direction="vertical" style={{ height: "100vh" }}>
          {suspense(<LazyReceiveHeader />)}

          <ul class="receive-file-list">
            <LazyList
              dataSource={fileList}
              renderItem={(item, index) => (
                <FileListItem
                  index={index}
                  name={item.name}
                  percent={100}
                  size={item.size}
                  path={item.path}
                />
              )}
            />

            <LazyList
              dataSource={taskList}
              renderItem={(item) => (
                <FileListItem
                  path={item.path}
                  name={item.name}
                  percent={Math.round(item.percent)}
                  speed={item.speed}
                  size={item.size}
                />
              )}
            />
          </ul>
        </LazyFlex>

        {floatButtons()}
      </Match>
    </Switch>
  );
};

export default Receive;
