import { globalStyle } from "@vanilla-extract/css";
import { darkTheme, lightTheme } from "./themes/themes.css";

globalStyle('[data-theme="dark"]', {
  vars: darkTheme,
});

globalStyle('[data-theme="light"]', {
  vars: lightTheme,
});

globalStyle("*", {
  userSelect: "none",
  WebkitUserSelect: "none",
  cursor: "default !important", // override all cursor styles
});

globalStyle("#root", {
  height: "100vh",
  paddingTop: import.meta.env.TAURI_ENV_PLATFORM === "darwin" ? "26px" : "36px",
});
