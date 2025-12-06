import {
  createMemo,
  For,
  onCleanup,
  onMount,
  Show,
  useContext,
} from "solid-js";

import { createStore } from "solid-js/store";

import { AiOutlineDelete } from "solid-icons/ai";

import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { TauriEvent } from "@tauri-apps/api/event";
import { message } from "@tauri-apps/plugin-dialog";

import { getFilesMetadata, getSendFilesUrlQrCode } from "~/api";

import { LazyButton, LazyCard } from "~/lazy";

import { AppContext } from "~/context";

import Flex from "~/components/flex";
import FileTypeIcon from "~/components/file-type-icon";
import EllipsisText from "~/components/ellipsis";
import EmptyList from "~/components/emptyList";

import { deleteRepetition } from "./utils";

import { neumorphicScrollbar } from "~/themes/neumorphic.css";
import * as styles from "./index.css";

const appWindow = getCurrentWebviewWindow();

const SendPage = () => {
  const { translations, setQrCode, goHomePage } = useContext(AppContext)!;

  const [files, setFiles] = createStore<SendFile[]>([]);

  onMount(() => {
    const unlisten = appWindow.listen<{ paths: string[] }>(
      TauriEvent.DRAG_DROP,
      async (e) => {
        console.log(e.payload);
        const paths = deleteRepetition(e.payload.paths, files);
        const sendFiles = await getFilesMetadata(paths);

        setFiles((pre) => [...pre, ...sendFiles]);
      }
    );

    onCleanup(() => {
      unlisten.then((f) => f());
    });
  });

  const removeFile = (path: string) =>
    setFiles((pre) => pre.filter((f) => f.path !== path));

  const newSendFilesQrCode = async () => {
    const code = await getSendFilesUrlQrCode(files);
    code.onClose = async () => {
      await message("文件未下载完成时请勿退出此程序");
      goHomePage();
    };
    setQrCode(code);
  };

  const isEmpty = createMemo(() => files.length === 0);

  return (
    <Flex direction="vertical" flex={1}>
      <Flex
        class={neumorphicScrollbar}
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
              <LazyCard padding="sm" style={{ overflow: "unset" }} hoverable>
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
                      <EllipsisText position="middle" text={item.name} />
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
                      onClick={() => removeFile(item.path)}
                    />
                  </div>
                </Flex>
              </LazyCard>
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
  );
};

export default SendPage;
