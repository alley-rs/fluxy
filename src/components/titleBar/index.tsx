import { createSignal, Show, useContext } from "solid-js";

import { AiFillHome } from "solid-icons/ai";

import { getCurrentWindow } from "@tauri-apps/api/window";

import useTheme from "~/hooks/useTheme";

import { AppContext } from "~/context";

import { Mode } from "~/App";
import { LazyButton } from "~/lazy";

import * as styles from "./index.css";

const appWindow = getCurrentWindow();

const isMacOS = import.meta.env.TAURI_ENV_PLATFORM === "darwin";

const TitleBar = () => (isMacOS ? <MacosTitleBar /> : <WindowsTitleBar />);

const PageTitle = () => {
  const { mode, translations } = useContext(AppContext)!;

  return (
    <Show when={mode()} fallback={<span>{/* 占位 */}</span>}>
      <span classList={{ [styles.center]: isMacOS, [styles.title]: true }}>
        {mode() === Mode.Receive
          ? translations()?.home_receive_button_text
          : translations()?.home_send_button_text}
      </span>
    </Show>
  );
};

const HomePageButton = () => {
  const { mode, goHomePage, translations } = useContext(AppContext)!;

  return (
    <Show when={mode()} fallback={<span>{/* 占位 */}</span>}>
      <LazyButton
        class={styles.button}
        variant="secondary"
        onClick={goHomePage}
        icon={<AiFillHome font-size="16px" />}
        shape="square"
        size="sm"
        title={translations()?.home_button_text}
      />
    </Show>
  );
};

const ColorModeButton = () => {
  const { translations } = useContext(AppContext)!;

  const [isDark, setIsDark] = useTheme();

  return (
    <LazyButton
      class={styles.button}
      variant="secondary"
      onClick={() => setIsDark((prev) => !prev)}
      icon={isDark() ? "☀️" : "🌙"}
      shape="square"
      size="sm"
      title={
        isDark()
          ? translations()?.dark_mode_tooltip
          : translations()?.light_mode_tooltip
      }
    />
  );
};

const MacosTitleBar = () => {
  return (
    <div
      data-tauri-drag-region
      classList={{
        [styles.macos]: true,
      }}
    >
      <PageTitle />
      <ColorModeButton />
      <HomePageButton />
    </div>
  );
};

const WindowsTitleBar = () => {
  const [isMaximized, setIsMaximized] = createSignal(false);

  const minimizeWindow = () => appWindow.minimize();

  const toggleMaximize = () => {
    appWindow.toggleMaximize();
    setIsMaximized((prev) => !prev);
  };

  const closeWindow = () => appWindow.close();

  return (
    <div
      data-tauri-drag-region
      classList={{
        [styles.windows]: true,
        [styles.macos]: isMacOS,
      }}
    >
      <HomePageButton />
      <PageTitle />

      <div>
        <ColorModeButton />

        <LazyButton
          class={styles.button}
          variant="secondary"
          onClick={minimizeWindow}
          icon="—"
          shape="square"
          size="sm"
          title="最小化"
        />

        <LazyButton
          class={styles.button}
          variant="secondary"
          onClick={toggleMaximize}
          icon={isMaximized() ? "🗗️" : "🗖️"}
          shape="square"
          size="sm"
          title={isMaximized() ? "恢复" : "最大化"}
        />

        <LazyButton
          classList={{ [styles.closeButton]: true, [styles.button]: true }}
          variant="danger"
          onClick={closeWindow}
          icon="✕"
          shape="square"
          size="sm"
          title="关闭"
        />
      </div>
    </div>
  );
};

export default TitleBar;
