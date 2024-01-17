import { Button } from "antd";
import { open } from "@tauri-apps/api/shell";

interface QRCodeProps {
  qrcode: QrCode;
}

const QRCode = ({ qrcode }: QRCodeProps) => {
  return (
    <>
      <h2>扫码连接</h2>
      <div dangerouslySetInnerHTML={{ __html: qrcode.svg }} />

      <div>或在另一台电脑中通过浏览器中访问</div>
      <Button
        className="send-button"
        type="link"
        onClick={async () => await open(qrcode.url)}
      >
        {qrcode.url}
      </Button>
    </>
  );
};

export default QRCode;
