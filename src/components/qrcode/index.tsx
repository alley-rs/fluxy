import { open } from "@tauri-apps/plugin-shell";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

import { AiFillCopy } from "solid-icons/ai";
import { useContext } from "solid-js";

import { AppContext } from "~/context";

import { Card } from "../card";
import { Tooltip } from "../tooltip";
import { toast } from "../toast";

import * as styles from "./index.css";
import { LazyButton } from "~/lazy";

interface QRCodeProps {
  qrcode: QrCode;
}

const QRCode = ({ qrcode }: QRCodeProps) => {
  const { translations } = useContext(AppContext)!;

  return (
    <div class={styles.wrapper}>
      <Card>
        <div class={styles.contentWrapper}>
          <h2>{translations()?.qrcode_page_title}</h2>
          <div class={styles.svg} innerHTML={qrcode.svg} />

          <div class={styles.footer}>
            <div>{translations()?.qrcode_page_url_label}</div>

            <span
              class={styles.link}
              onClick={async () => await open(qrcode.url)}
            >
              {qrcode.url}
            </span>

            <Tooltip
              content={translations()!.qrcode_page_url_tooltip}
              position="left"
            >
              <LazyButton
                icon={<AiFillCopy />}
                iconOnly
                shape="circle"
                onClick={() => {
                  writeText(qrcode.url);
                  toast.success(
                    translations()?.qrcode_page_url_copied_message,
                    {
                      position: "bottom",
                    },
                  );
                }}
              />
            </Tooltip>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QRCode;
