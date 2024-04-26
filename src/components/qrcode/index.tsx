import { open } from "@tauri-apps/plugin-shell";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import {
  LazyButton,
  LazyFlex,
  LazyLink,
  LazySpace,
  LazyToast,
  LazyTooltip,
} from "~/lazy";
import "./index.scss";
import { AiFillCopy } from "solid-icons/ai";
import { createSignal } from "solid-js";

interface QRCodeProps {
  qrcode: QrCode;
}

const baseClassName = "qr-code";

const QRCode = ({ qrcode }: QRCodeProps) => {
  const [copyError, setCopyError] = createSignal<string | boolean>(false);

  return (
    <LazyFlex
      class={baseClassName}
      align="center"
      justify="center"
      direction="vertical"
    >
      <h2>扫码连接</h2>
      <div class={`${baseClassName}-svg`} innerHTML={qrcode.svg} />

      <div>或在另一台电脑中通过浏览器中访问</div>

      <LazySpace direction="vertical" gap={8}>
        <LazyLink
          class={`${baseClassName}-link`}
          onClick={async () => await open(qrcode.url)}
          filter={false}
        >
          {qrcode.url}
        </LazyLink>

        <LazyTooltip text="复制链接到剪贴板">
          <LazyButton
            icon={<AiFillCopy />}
            shape="circle"
            onClick={async () => {
              console.log(qrcode.url);
              try {
                await writeText(qrcode.url);
                setCopyError(true);
              } catch (e) {
                setCopyError(String(e));
                console.error(e);
              }
            }}
          />
        </LazyTooltip>
      </LazySpace>

      <LazyToast
        placement="bottom"
        open={!!copyError()}
        onClose={() => setCopyError(false)}
        autoHideDuration={1000}
        alert={
          copyError() === true
            ? {
                type: "success",
                message: "已复制链接",
              }
            : { type: "error", message: copyError() }
        }
      />
    </LazyFlex>
  );
};

export default QRCode;
