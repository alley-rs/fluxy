import {
  createEffect,
  createSignal,
  onCleanup,
  createMemo,
  Show,
} from "solid-js";
import { TiDeleteOutline } from "solid-icons/ti";
import { TbHome, TbTrash } from "solid-icons/tb";
import { appWindow } from "@tauri-apps/api/window";
import { TauriEvent } from "@tauri-apps/api/event";
import "./index.scss";
import { getFilesMetadata, getSendFilesUrlQrCode, getQrCodeState } from "~/api";
import { deleteRepetition } from "./utils";
import avatar from "./avatar";
import { suspense } from "~/advance";
import {
  LazyButton,
  LazyEmpty,
  LazyFlex,
  LazyFloatButtons,
  LazyList,
} from "~/lazy";

interface SendProps {
  toHome: () => void;
}

const Send = (props: SendProps) => {
  const [files, setFiles] = createSignal<SendFile[]>([]);

  const [qrcode, setQrcode] = createSignal<QrCode | null>(null);

  createEffect(() => {
    const unlisten = appWindow.listen<string[]>(
      TauriEvent.WINDOW_FILE_DROP,
      async (e) => {
        const paths = deleteRepetition(e.payload, files() ?? []);
        const sendFiles = await getFilesMetadata(paths);

        setFiles((pre) => [...pre, ...sendFiles]);
      },
    );

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

    onCleanup(() => {
      clearTimeout(timer);
      location.reload();
    });
  });

  const removeFile = (path: string) =>
    setFiles((pre) => pre!.filter((f) => f.path !== path));

  const newSendFilesQrCode = async () => {
    const code = await getSendFilesUrlQrCode(files()!);
    setQrcode(code);
  };

  const isEmpty = createMemo(() => files().length === 0);
  const filesPostion = () => (isEmpty() ? "center" : "start");

  createEffect(() => console.log("数量", files().length, isEmpty()));

  return (
    <>
      <Show
        when={!qrcode()}
        fallback={
          <LazyFlex
            class="send"
            align="center"
            justify="center"
            direction="vertical"
          >
            <h2>扫码连接</h2>
            <div innerHTML={qrcode()!.svg} />
          </LazyFlex>
        }
      >
        <LazyFlex
          class="send"
          align="center"
          justify="center"
          direction="vertical"
        >
          <LazyFlex
            class="file-list"
            align={filesPostion()}
            justify={filesPostion()}
          >
            {files().length ? (
              <LazyList
                dataSource={files()}
                renderItem={(file) => (
                  <LazyList.Item
                    avatar={avatar(file.extension)}
                    title={file.name}
                    description={
                      <>
                        <span>大小: {file.size}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span>类型: {file.extension}</span>
                      </>
                    }
                    extra={[
                      <LazyButton
                        type="danger"
                        shape="circle"
                        icon={<TiDeleteOutline />}
                        onClick={() => removeFile(file.path)}
                      />,
                    ]}
                  />
                )}
              />
            ) : (
              <LazyEmpty description="将文件拖到此处" />
            )}
          </LazyFlex>

          <LazyButton onClick={newSendFilesQrCode} block disabled={isEmpty()}>
            确认
          </LazyButton>
        </LazyFlex>
      </Show>

      {isEmpty()
        ? suspense(
            <LazyFloatButtons
              icon={<TbHome />}
              onClick={props.toHome}
              tooltip="回到主页"
              bottom={60}
            />,
          )
        : suspense(
            <LazyFloatButtons.Group
              bottom={60}
              options={[
                {
                  icon: <TbTrash />,
                  onClick: () => setFiles([]),
                  tooltip: "清空文件",
                },
                {
                  icon: <TbHome />,
                  onClick: props.toHome,
                  tooltip: "回到主页",
                },
              ]}
            />,
          )}
    </>
  );
};

export default Send;
