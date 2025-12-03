import { createSignal, onMount, Show } from "solid-js";

import * as styles from "./index.css";

export const Overlay = () => {
  const [focused, setFocused] = createSignal(false);

  onMount(() => {
    // 页面失焦时显示遮罩
    window.addEventListener("blur", () => {
      setFocused(false);
    });

    // 页面聚焦时隐藏遮罩
    window.addEventListener("focus", () => {
      setFocused(true);
    });
  });

  return (
    <Show when={!focused()}>
      <div class={styles.overlay} />
    </Show>
  );
};
