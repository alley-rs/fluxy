import {
  type Accessor,
  createEffect,
  createSignal,
  onMount,
  type Setter,
} from "solid-js";

export type ThemeID = "dark" | "light" | "system";

export default function useTheme(
  themeID: ThemeID = "system",
): [Accessor<boolean>, Setter<boolean>] {
  const [isDark, setIsDark] = createSignal(themeID === "dark");

  onMount(() => {
    // 只有system模式才执行下面的监听
    if (themeID !== "system") return;

    // 设置默认主题色
    if (matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }

    // 监听系统颜色切换
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (event.matches) {
          setIsDark(true);
        } else {
          setIsDark(false);
        }
      });
  });

  createEffect(() => {
    window.document.documentElement.setAttribute(
      "data-theme",
      isDark() ? "dark" : "light",
    );
  });

  return [isDark, setIsDark];
}
