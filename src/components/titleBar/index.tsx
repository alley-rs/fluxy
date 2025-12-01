import { createSignal, Show, useContext } from "solid-js";

import { AiFillHome } from "solid-icons/ai";

import useTheme from "~/hooks/useTheme";

import { AppContext } from "~/context";

import { getCurrentWindow } from "@tauri-apps/api/window";

import { Mode } from "~/App";
import { LazyButton } from "~/lazy";

import * as styles from "./index.css";

const appWindow = getCurrentWindow();

const TitleBar = () => {
  const { mode, goHomePage, translations } = useContext(AppContext)!;

  const [isMaximized, setIsMaximized] = createSignal(false);

  const [isDark, setIsDark] = useTheme();

  const minimizeWindow = () => appWindow.minimize();

  const toggleMaximize = () => {
    appWindow.toggleMaximize();
    setIsMaximized((prev) => !prev);
  };

  const closeWindow = () => appWindow.close();

  return (
    <div data-tauri-drag-region class={styles.titlebar}>
      <Show when={mode()} fallback={<span>{/* 占位 */}</span>}>
        <div
          style={{
            display: "inline-flex",
            "align-items": "center",
          }}
        >
          <LazyButton
            class={styles.button}
            variant="secondary"
            onClick={goHomePage}
            icon={<AiFillHome font-size="16px" />}
            shape="square"
            size="sm"
            title={translations()?.home_button_text}
          />

          <span
            style={{
              "font-weight": 500,
              "font-size": "0.9rem",
              "margin-left": ".5rem",
            }}
          >
            {mode() === Mode.Receive
              ? translations()?.home_receive_button_text
              : translations()?.home_send_button_text}
          </span>
        </div>
      </Show>

      <div>
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
