import { open } from "@tauri-apps/api/shell";
import { writeText } from "@tauri-apps/api/clipboard";
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
import { createSignal, useContext } from "solid-js";
import { AppContext } from "~/context";

interface QRCodeProps {
  qrcode: QrCode;
}

const baseClassName = "qr-code";

const QRCode = ({ qrcode }: QRCodeProps) => {
  const { translations } = useContext(AppContext)!;
  const [showToast, setShowToast] = createSignal(false);

  return (
    <LazyFlex
      class={baseClassName}
      align="center"
      justify="center"
      direction="vertical"
    >
      <LazyToast
        placement="top"
        open={true}
        message={translations()?.qrcode_page_toast_message}
        onClose={() => { }}
      />

      <h2>{translations()?.qrcode_page_title}</h2>
      <div class={`${baseClassName}-svg`} innerHTML={qrcode.svg} />

      <div>{translations()?.qrcode_page_url_label}</div>

      <LazySpace direction="vertical" gap={8}>
        <LazyLink
          class={`${baseClassName}-link`}
          onClick={async () => await open(qrcode.url)}
          filter={false}
        >
          {qrcode.url}
        </LazyLink>

        <LazyTooltip text={translations()!.qrcode_page_url_tooltip}>
          <LazyButton
            icon={<AiFillCopy />}
            shape="circle"
            onClick={() => {
              writeText(qrcode.url);
              setShowToast(true);
            }}
          />
        </LazyTooltip>
      </LazySpace>

      <LazyToast
        placement="bottom"
        open={showToast()}
        onClose={() => setShowToast(false)}
        autoHideDuration={1000}
        alert={{
          type: "success",
          message: translations()?.qrcode_page_url_copied_message,
        }}
      />
    </LazyFlex>
  );
};

export default QRCode;
