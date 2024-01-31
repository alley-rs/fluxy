import { open } from "@tauri-apps/api/shell";
import { LazyFlex, LazyLink } from "~/lazy";
import "./index.scss";

interface QRCodeProps {
  qrcode: QrCode;
}

const baseClassName = "qr-code";

const QRCode = ({ qrcode }: QRCodeProps) => {
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

      <LazyLink
        class={`${baseClassName}-link`}
        onClick={async () => await open(qrcode.url)}
      >
        {qrcode.url}
      </LazyLink>
    </LazyFlex>
  );
};

export default QRCode;
