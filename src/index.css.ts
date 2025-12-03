import { globalStyle } from "@vanilla-extract/css";
import { darkTheme, lightTheme, themeContract } from "./themes/themes.css";

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
  paddingTop: "36px",
});

globalStyle("::-webkit-scrollbar", {
  width: "10px",
  height: "10px",
});

globalStyle("::-webkit-scrollbar-track", {
  backgroundColor: "transparent",
});

globalStyle("::-webkit-scrollbar-thumb", {
  backgroundColor: themeContract.color.scrollbarThumb,
  borderRadius: "10px",
  border: "2px solid transparent",
  backgroundClip: "padding-box",
  boxShadow: `inset 2px 2px 4px ${themeContract.color.shadowLight}, inset -2px -2px 4px ${themeContract.color.shadowDark}`,
});

globalStyle("::-webkit-scrollbar-thumb:hover", {
  backgroundColor: themeContract.color.scrollbarThumbHover,
  boxShadow: `inset 1px 1px 3px ${themeContract.color.shadowLight}, inset -1px -1px 3px ${themeContract.color.shadowDark}`,
});

globalStyle("::-webkit-scrollbar-thumb:active", {
  backgroundColor: themeContract.color.scrollbarThumbHover,
  boxShadow: `inset 3px 3px 6px ${themeContract.color.shadowDark}, inset -1px -1px 2px ${themeContract.color.shadowLight}`,
});
