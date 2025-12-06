import { style } from "@vanilla-extract/css";
import { themeContract, tokens } from "~/themes/themes.css";

export const fileicon = style({
  width: "24px",
  fontSize: tokens.fontSize.lg,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: tokens.spacing.xs,
});

export const description = style({
  color: themeContract.color.secondary,
  fontSize: tokens.fontSize.xs,
});

export const removeButton = style({
  display: "flex",
  width: "36px",
  justifyContent: "flex-end",
});
