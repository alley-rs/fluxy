import { globalStyle } from "@vanilla-extract/css";
import { darkTheme, lightTheme } from "./themes/themes.css";

globalStyle('[data-theme="dark"]', {
  vars: darkTheme,
});

globalStyle('[data-theme="light"]', {
  vars: lightTheme,
});

globalStyle("#root", {
  height: "100vh",
  paddingTop: "36px",
});
