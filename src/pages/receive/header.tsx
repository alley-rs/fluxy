import { open as pick } from "@tauri-apps/plugin-dialog";
import { open } from "@tauri-apps/plugin-shell";
import { createEffect, createSignal, useContext } from "solid-js";
import { changeDownloadsDir, getDownloadsDir } from "~/api";
import Loading from "alley-components/lib/components/spinner";
import { AppContext } from "~/context";
import { Card } from "~/components/card";
import { LazyButton } from "~/lazy";

const Header = () => {
  const { translations } = useContext(AppContext)!;

  const [downloadDir, setDownloadDir] = createSignal<string | undefined>(
    undefined,
  );

  createEffect(() => {
    const dir = downloadDir();
    if (dir) return;

    getDownloadsDir().then((d) => setDownloadDir(d));
  });

  const pickDirectory = async () => {
    const dir = (await pick({
      directory: true,
      defaultPath: downloadDir(),
      multiple: false,
      title: "选择其他目录", // https://github.com/tauri-apps/tauri/issues/6675
    })) as string | null;

    if (!dir) return;

    await changeDownloadsDir(dir);

    setDownloadDir(dir);
  };

  if (!downloadDir) return <Loading />;

  return (
    <Card style={{ overflow: "unset" }}>
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
        }}
      >
        <div>
          📂
          <span
            onClick={async () => {
              open(downloadDir()!);
            }}
          >
            {downloadDir()!}
          </span>
        </div>

        <LazyButton size="sm" onClick={pickDirectory}>
          {translations()!.receive_page_dropdown_pick_button_label}
        </LazyButton>
      </div>
    </Card>
  );
};

export default Header;
