import {
  createEffect,
  createSignal,
  onCleanup,
  createMemo,
  Show,
  children,
  useContext,
} from "solid-js";
import {
  AiOutlineClear,
  AiOutlineCloseCircle,
  AiOutlineHome,
} from "solid-icons/ai";
import { appWindow } from "@tauri-apps/api/window";
import { TauriEvent } from "@tauri-apps/api/event";
import "./index.scss";
import { getFilesMetadata, getSendFilesUrlQrCode, getQrCodeState } from "~/api";
import { deleteRepetition } from "./utils";
import {
  LazyAboutButton,
  LazyButton,
  LazyEmpty,
  LazyFileTypeIcon,
  LazyFlex,
  LazyFloatButton,
  LazyFloatButtonGroup,
  LazyLink,
  LazyList,
  LazyListItem,
  LazyQrcode,
  LazyTooltip,
  LazyTypographyText,
} from "~/lazy";
import { addClassNames } from "alley-components/lib/utils/class";
import { open } from "@tauri-apps/api/shell";
import { AppContext } from "~/context";

const Send = () => {
  const { goHome, translations } = useContext(AppContext)!;

  const [files, setFiles] = createSignal<SendFile[]>([]);

  const [qrcode, setQrcode] = createSignal<QrCode | null>(null);

  createEffect(() => {
    const unlisten = appWindow.listen<string[]>(
      TauriEvent.WINDOW_FILE_DROP,
      async (e) => {
        const paths = deleteRepetition(e.payload, files());
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
    setFiles((pre) => pre.filter((f) => f.path !== path));

  const newSendFilesQrCode = async () => {
    const code = await getSendFilesUrlQrCode(files());
    setQrcode(code);
  };

  const isEmpty = createMemo(() => files().length === 0);
  const filesPostion = () => (isEmpty() ? "center" : "start");

  const floatButtons = children(() => (
    <LazyFloatButtonGroup bottom={qrcode() ? 20 : 60}>
      <LazyAboutButton />

      <Show when={!isEmpty() && !qrcode()}>
        <LazyFloatButton
          icon={<AiOutlineClear />}
          onClick={() => setFiles([])}
          danger
          tooltip={translations()?.clear_button_text}
        />
      </Show>

      <LazyFloatButton
        tooltip={translations()?.home_button_text}
        icon={<AiOutlineHome />}
        onClick={goHome}
      />
    </LazyFloatButtonGroup>
  ));

  return (
    <>
      <Show when={!qrcode()} fallback={<LazyQrcode qrcode={qrcode()!} />}>
        <LazyFlex
          class="send"
          align="center"
          justify="center"
          direction="vertical"
        >
          <div class="send-header">{translations()?.send_page_title}</div>

          <LazyFlex
            class={addClassNames(
              "file-list",
              !files().length ? "file-list-empty" : undefined,
            )}
            align={filesPostion()}
            justify={filesPostion()}
          >
            {files().length ? (
              <LazyFlex direction="vertical" class="file-list-wrapper">
                <LazyList
                  dataSource={files()}
                  renderItem={(file) => (
                    <LazyListItem
                      avatar={LazyFileTypeIcon(file.extension)}
                      title={
                        <LazyTooltip
                          text={translations()!.send_page_list_item_tooltip}
                          placement="top"
                        >
                          <LazyLink onClick={() => open(file.path)}>
                            {file.name}
                          </LazyLink>
                        </LazyTooltip>
                      }
                      description={
                        <>
                          <span>
                            {translations()?.list_item_file_size_label}:{" "}
                            {file.size}
                          </span>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <span>
                            {translations()?.list_item_file_type_label}:{" "}
                            {file.extension}
                          </span>
                        </>
                      }
                      extra={[
                        <LazyButton
                          class="delete-file"
                          shape="circle"
                          type="plain"
                          danger
                          onClick={() => removeFile(file.path)}
                        >
                          <AiOutlineCloseCircle />
                        </LazyButton>,
                      ]}
                    />
                  )}
                />

                <LazyTypographyText type="secondary">
                  {translations()?.send_page_drop_description}
                </LazyTypographyText>
              </LazyFlex>
            ) : (
              <LazyEmpty
                description={translations()?.send_page_empty_drop_description}
              />
            )}
          </LazyFlex>

          <LazyButton
            filter
            onClick={newSendFilesQrCode}
            block
            disabled={isEmpty()}
          >
            {translations()?.ok_button_text}
          </LazyButton>
        </LazyFlex>
      </Show>

      {floatButtons()}
    </>
  );
};

export default Send;
