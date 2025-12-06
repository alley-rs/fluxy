import { style } from "@vanilla-extract/css";
import { themeContract, tokens } from "~/themes/themes.css";

export const filename = style({
  fontWeight: tokens.fontWeight.semibold,
  fontSize: tokens.fontSize.lg,
  color: themeContract.color.secondary,
});

export const filenameClickable = style({
  cursor: "pointer",
  color: themeContract.color.foreground,

  ":hover": {
    textDecoration: "underline",
  },
});

export const description = style({
  color: themeContract.color.secondary,
  fontSize: tokens.fontSize.xs,
});
