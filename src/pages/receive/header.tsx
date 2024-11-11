import { open as pick } from "@tauri-apps/api/dialog";
import { open } from "@tauri-apps/api/shell";
import { createEffect, createSignal, onMount, useContext } from "solid-js";
import { changeDownloadsDir, getDownloadsDir, isLinux } from "~/api";
import type { MenuItemProps } from "alley-components/lib/components/dropdown";
import Loading from "alley-components/lib/components/spinner";
import { LazyCol, LazyDropdown, LazyLink, LazyRow, LazyTooltip } from "~/lazy";
import { AppContext } from "~/context";

const baseClassName = "receive-header";

const Header = () => {
  const { translations } = useContext(AppContext)!;

  const [downloadDir, setDownloadDir] = createSignal<string | undefined>(
    undefined,
  );
  const [openDropDown, setOpenDropDown] = createSignal(false);

  const [dropdownTop, setDownloadTop] = createSignal(40);

  onMount(() => {
    isLinux().then((f) => f && setDownloadTop(30));
  });

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
      label: translations()!.receive_page_dropdown_open_button_label,
      onClick: () => open(downloadDir()!),
    },
    {
      label: translations()!.receive_page_dropdown_pick_button_label,
      onClick: () => pickDirectory(),
    },
  ];

  if (!downloadDir) return <Loading />;

  return (
    <LazyRow class={baseClassName}>
      <LazyCol
        span={4}
        class={`${baseClassName}-label`}
        align="center"
        justify="center"
      >
        <LazyDropdown
          open={openDropDown()}
          menu={dropdownItems}
          top={dropdownTop()}
          left={18}
        >
          <span class={`${baseClassName}-label-text`}>
            {translations()?.receive_page_directory_path_label}
          </span>
        </LazyDropdown>
      </LazyCol>

      <LazyCol
        span={15}
        class={`${baseClassName}-directory-entry`}
        align="center"
        justify="center"
      >
        <LazyTooltip
          text={translations()!.receive_page_directory_path_tooltip}
          placement="bottom"
        >
          <LazyLink
            onClick={async () => {
              setOpenDropDown(false);
              open(downloadDir()!);
            }}
            wrap
          >
            {downloadDir()!}
          </LazyLink>
        </LazyTooltip>
      </LazyCol>
    </LazyRow>
  );
};

export default Header;
