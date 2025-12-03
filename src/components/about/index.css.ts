import { style } from "@vanilla-extract/css";
import { themeContract, tokens } from "~/themes/themes.css";

export const about = style({
  color: themeContract.color.secondary,
});

export const label = style({
  fontWeight: tokens.fontWeight.semibold,
});

export const aboutButton = style({});
