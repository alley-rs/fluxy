import { open as pick } from "@tauri-apps/api/dialog";
import { open } from "@tauri-apps/api/shell";
import { createEffect, createSignal } from "solid-js";
import { changeDownloadsDir, getDownloadsDir } from "~/api";
import Col from "~/components/col";
import Dropdown, { MenuItemProps } from "~/components/dropdown";
import Loading from "~/components/loading";
import Row from "~/components/row";

const Header = () => {
  const [downloadDir, setDownloadDir] = createSignal<string | undefined>(
    undefined,
  );
  const [openDropDown, setOpenDropDown] = createSignal(false);

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

  const dropdownItems: MenuItemProps[] = [
    {
      label: "打开",
      onClick: () => open(downloadDir()!),
    },
    {
      label: "修改",
      onClick: () => pickDirectory(),
    },
  ];

  if (!downloadDir) return <Loading />;

  return (
    <Row class="header">
      <Col span={6} class="directory-button-label">
        <span style={{ "font-size": "0.8rem" }}>保存目录：</span>
      </Col>

      <Col span={18} class="directory-entry">
        <Dropdown
          open={openDropDown()}
          onOpenChange={() => setOpenDropDown((pre) => !pre)}
          menu={dropdownItems}
        >
          <a
            // type="link"
            onClick={async () => {
              setOpenDropDown(false);
              open(downloadDir()!);
            }}
            style={{ "text-overflow": "ellipsis" }}
          >
            {downloadDir()!}
          </a>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default Header;
