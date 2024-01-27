import { open } from "@tauri-apps/api/shell";
import { LazyLink } from "~/lazy";

interface QRCodeProps {
  qrcode: QrCode;
}

const QRCode = ({ qrcode }: QRCodeProps) => {
  return (
    <>
      <h2>扫码连接</h2>
      <div class="qr-code" innerHTML={qrcode.svg} />

      <div>或在另一台电脑中通过浏览器中访问</div>

      <LazyLink class="send-link" onClick={async () => await open(qrcode.url)}>
        {qrcode.url}
      </LazyLink>
    </>
  );
};

export default QRCode;
