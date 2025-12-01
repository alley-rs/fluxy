import { style } from "@vanilla-extract/css";
import { themeContract, tokens } from "~/themes/themes.css";

export const wrapper = style({
  position: "relative",
});

export const textWrapper = style({
  textAlign: "center",
  marginTop: "1.5rem",
});

export const title = style({
  fontWeight: tokens.fontWeight.semibold,
  fontSize: "1.5rem",
  lineHeight: "2rem",
  marginBottom: ".5rem",
  color: themeContract.color.foreground,
});

export const description = style({
  color: themeContract.color.secondary,
  fontSize: tokens.fontSize.sm,
});
