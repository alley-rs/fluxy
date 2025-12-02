import { style } from "@vanilla-extract/css";
import { themeContract } from "~/themes/themes.css";
import { buttonBase } from "../button/Button.css";

export const macos = style({
  height: "26px",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  borderColor: "transparent",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",

  ":hover": {
    boxShadow: `${themeContract.color.shadowLight} -2px -2px 4px, ${themeContract.color.shadowDark} 3px 3px 8px`,
  },
});

export const windows = style({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  borderColor: "transparent",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: `${themeContract.color.shadowLight} -2px -2px 4px, ${themeContract.color.shadowDark} 3px 3px 8px`,
});

export const button = style({
  // padding: "0 12px",
  // maxWidth: "46px !important",
  // minWidth: "46px !important",
  // boxShadow: "none",
  // backgroundColor: "transparent",

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
});

export const center = style({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
});
