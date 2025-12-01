import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  useContext,
} from "solid-js";

import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

import Flex from "~/components/flex";

import { AppContext } from "~/context";
import { TauriEvent } from "@tauri-apps/api/event";
import { deleteRepetition } from "./utils";
import { getFilesMetadata, getQrCodeState, getSendFilesUrlQrCode } from "~/api";
import { Card } from "~/components/card";
import FileTypeIcon from "~/components/file-type-icon";
import { AiOutlineDelete } from "solid-icons/ai";

import * as styles from "./index.css";
import MiddleEllipsisText from "~/components/ellipsis";
import { createStore } from "solid-js/store";
import { LazyButton, LazyQrcode } from "~/lazy";
import EmptyList from "~/components/emptyList";
import { toast } from "~/components/toast";

const appWindow = getCurrentWebviewWindow();

const SendPage = () => {
  const { translations } = useContext(AppContext)!;

  const [files, setFiles] = createStore<SendFile[]>([]);

  const [qrcode, setQrcode] = createSignal<QrCode | null>(null);

  onMount(() => {
    const unlisten = appWindow.listen<{ paths: string[] }>(
      TauriEvent.DRAG_DROP,
      async (e) => {
        console.log(e.payload);
        const paths = deleteRepetition(e.payload.paths, files);
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
        toast.warning("文件未下载完成时请勿退出此程序", { position: "bottom" });
        setQrcode(null);
      }
    }, 500);

    onCleanup(() => {
      clearTimeout(timer);
      location.reload();
    });
  });

  const removeFile = (path: string) =>
    setFiles((pre) => pre.filter((f) => f.path !== path));

  const newSendFilesQrCode = async () => {
    const code = await getSendFilesUrlQrCode(files);
    setQrcode(code);
  };

  const isEmpty = createMemo(() => files.length === 0);

  return (
    <Show when={!qrcode()} fallback={<LazyQrcode qrcode={qrcode()!} />}>
      <Flex direction="vertical" flex={1}>
        <Flex
          flex={1}
          direction="vertical"
          justify={isEmpty() ? "center" : "start"}
          align={isEmpty() ? "center" : "normal"}
          gap="md"
          wrap="nowrap"
          style={{ "overflow-y": "auto", padding: "16px" }}
        >
          <Show
            when={files.length > 0}
            fallback={<EmptyList description="拖拽文件到此处以添加" />}
          >
            <For each={files}>
              {(item) => (
                <Card style={{ overflow: "unset" }}>
                  <Flex
                    direction="horizontal"
                    justify="between"
                    align="center"
                    flex={1}
                  >
                    <span class={styles.fileicon}>
                      {FileTypeIcon(item.extension)}
                    </span>

                    <Flex justify="start" align="center" gap="sm" flex={1}>
                      <Flex direction="vertical" align="start">
                        <MiddleEllipsisText text={item.name} maxLength={30} />
                        <span class={styles.description}>
                          {item.size} • {item.extension}
                        </span>
                      </Flex>
                    </Flex>

                    <div class={styles.removeButton}>
                      <LazyButton
                        variant="danger"
                        icon={<AiOutlineDelete />}
                        size="sm"
                        iconOnly
                        onClick={() => removeFile(item.path)}
                      />
                    </div>
                  </Flex>
                </Card>
              )}
            </For>
          </Show>
        </Flex>

        <Flex gap="md" style={{ padding: "16px" }}>
          <LazyButton
            variant="danger"
            onClick={() => setFiles([])}
            disabled={isEmpty()}
          >
            {translations()?.clear_button_text}
          </LazyButton>
          <LazyButton
            style={{ flex: 1 }}
            onClick={newSendFilesQrCode}
            disabled={isEmpty()}
          >
            {translations()?.home_send_button_text}
          </LazyButton>
        </Flex>
      </Flex>
    </Show>
  );
};

export default SendPage;
