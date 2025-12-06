import { style } from "@vanilla-extract/css";
import { themeContract, tokens } from "~/themes/themes.css";
import { buttonBase } from "../button/Button.css";
import { flex } from "~/themes/primitives.css";

const titleBar = style([
  flex.centerY,
  {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    borderColor: "transparent",
    zIndex: tokens.zIndex.max,
  },
]);

export const macos = style([
  titleBar,
  {
    height: "26px",
    justifyContent: "flex-end",

    ":hover": {
      boxShadow: `${themeContract.color.shadowLight1} -2px -2px 4px, ${themeContract.color.shadowDark1} 3px 3px 8px`,
    },
  },
]);

export const windows = style([
  titleBar,
  {
    justifyContent: "space-between",
    boxShadow: `${themeContract.color.shadowLight1} -2px -2px 4px, ${themeContract.color.shadowDark1} 3px 3px 8px`,
  },
]);

export const button = style({
  selectors: {
    [`${buttonBase}&`]: {
      padding: "0 12px",
      maxWidth: "46px !important",
      minWidth: "46px !important",
      boxShadow: "none",
      backgroundColor: "transparent",
    },

    [`${macos} ${buttonBase}&`]: {
      maxWidth: "36px !important",
      minWidth: "36px !important",
      maxHeight: "26px",
      minHeight: "26px",
    },

    [`${buttonBase}&:active:not(:disabled)`]: {
      transform: "none",
    },
  },
});

export const closeButton = style({
  selectors: {
    [`${button}&`]: {
      backgroundColor: "transparent",
      color: themeContract.color.foreground,
    },

    "&:hover": {
      background: themeContract.color.error,
      color: "#fff",
      boxShadow: `
      inset 1px 1px 0 ${themeContract.color.errorShadowLight},
      inset -1px -1px 0 ${themeContract.color.errorShadowDark},
      ${themeContract.color.errorShadowLight} -2px -2px 4px,
      ${themeContract.color.errorShadowDark} 3px 3px 8px
    `,
    },
  },
});

export const title = style({
  fontWeight: 500,
  fontSize: "0.9rem",
  marginLeft: ".5rem",
  pointerEvents: "none",
});

export const center = style({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
});
