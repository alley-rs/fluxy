import {
  Match,
  Switch,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { appWindow } from "@tauri-apps/api/window";
import { OrderedSet } from "~/utils";
import { getUploadQrCode, getQrCodeState } from "~/api";
import FileListItem from "./fileListItem";
import "./index.scss";
import { suspense } from "~/advance";
import { LazyReceiveHeader, LazyReceiveQrCode, LazyFloatButtons } from "~/lazy";
import Flex from "~/components/flex";
import Empty from "~/components/empty";
import { TbHome } from "solid-icons/tb";

interface ReceiveProps {
  toHome: () => void;
}

const Receive = ({ toHome }: ReceiveProps) => {
  const [qrcode, setQrcode] = createSignal<QrCode | null>(null);

  const [taskList, setTaskList] = createSignal<OrderedSet<TaskMessage>>(
    new OrderedSet("name"),
  );
  const [fileList, setFileList] = createSignal<Omit<TaskMessage, "speed">[]>(
    [],
  );

  onMount(() => {
    if (qrcode() || !taskList().empty() || fileList().length) return;

    getUploadQrCode().then((c) => setQrcode(c));
  });

  createEffect(() => {
    const unlisten = appWindow.listen<TaskMessage>("upload://progress", (e) => {
      if (qrcode()) setQrcode(null);

      setTaskList((pre) => pre.push(e.payload));

      const { name, percent } = e.payload;

      if (percent === 100) {
        setTaskList((pre) => pre.remove(e.payload));

        setFileList((pre) => {
          const t = pre.find((v) => v.name === name);

          return t ? pre : [...pre, e.payload];
        });
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

  const homeButton = suspense(
    <LazyFloatButtons tooltip="回到主页" icon={<TbHome />} onClick={toHome} />,
  );

  return (
    <Switch>
      <Match when={qrcode() !== null}>
        <Flex class="send" align="center" justify="center" direction="vertical">
          {suspense(<LazyReceiveQrCode qrcode={qrcode()!} />)}

          {homeButton}
        </Flex>
      </Match>
      <Match when={taskList().empty() && !fileList().length}>
        <Flex
          direction="vertical"
          align="center"
          style={{ height: "100vh", padding: 0 }}
        >
          {suspense(<LazyReceiveHeader />)}
          <Flex flex={8} align="center" justify="center">
            <Empty description="请在手机端上传文件" />
          </Flex>
        </Flex>

        {homeButton}
      </Match>
      <Match
        when={qrcode() === null && (!taskList().empty() || fileList().length)}
      >
        <Flex direction="vertical" style={{ height: "100vh" }}>
          {suspense(<LazyReceiveHeader />)}

          <ul class="receive-file-list">
            {fileList().map((t) => (
              <FileListItem
                name={t.name}
                percent={100}
                size={t.size}
                path={t.path}
              />
            ))}

            {taskList().map((task) => (
              <FileListItem
                path={task.path}
                name={task.name}
                percent={Math.round(task.percent)}
                speed={task.speed}
                size={task.size}
              />
            ))}
          </ul>
        </Flex>

        {suspense(
          <LazyFloatButtons
            tooltip="回到主页"
            onClick={() => {
              setTaskList(new OrderedSet<TaskMessage>("name"));
              setFileList([]);
              toHome();
            }}
          />,
        )}
      </Match>
    </Switch>
  );
};

export default Receive;
