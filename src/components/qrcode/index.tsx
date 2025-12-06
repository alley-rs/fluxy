import { AiFillCopy } from "solid-icons/ai";
import { createEffect, onCleanup, useContext } from "solid-js";

import { open } from "@tauri-apps/plugin-shell";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

import { AppContext } from "~/context";

import { toast } from "../toast";

import * as styles from "./index.css";
import { LazyButton, LazyDialog, LazyTooltip } from "~/lazy";
import { getQrCodeState } from "~/api";

const QRCode = () => {
  const { translations, qrCode, setQrCode } = useContext(AppContext)!;

  createEffect(() => {
    const code = qrCode();
    if (!code) return;

    const timer = setInterval(async () => {
      const used = await getQrCodeState(code.id);

      if (used) {
        clearTimeout(timer);
        setQrCode();
      }
    }, 500);

    onCleanup(() => clearTimeout(timer));
  });

  return (
    <LazyDialog
      open={!!qrCode()}
      title={translations()?.qrcode_page_title}
      titleCentered
    >
      <div class={styles.contentWrapper}>
        <div class={styles.svg} innerHTML={qrCode()?.svg} />

        <div class={styles.footer}>
          <div>{translations()?.qrcode_page_url_label}</div>

          <span
            class={styles.link}
            onClick={async () => await open(qrCode()!.url)}
          >
            {qrCode()?.url}
          </span>

          <LazyTooltip
            content={translations()!.qrcode_page_url_tooltip}
            position="left"
          >
            <LazyButton
              icon={<AiFillCopy />}
              shape="circle"
              onClick={() => {
                writeText(qrCode()?.url ?? "");
                toast.success(translations()?.qrcode_page_url_copied_message, {
                  position: "bottom",
                });
              }}
            />
          </LazyTooltip>
        </div>
      </div>
    </LazyDialog>
  );
};

export default QRCode;
