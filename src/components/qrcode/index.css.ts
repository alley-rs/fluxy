import { style } from "@vanilla-extract/css";
import { generateOuterShadow } from "~/themes/helpers";
import { tokens } from "~/themes/themes.css";

export const wrapper = style({
  flex: 1,
  padding: "64px 36px",
  display: "flex",
  justifyContent: "center",
});

export const contentWrapper = style({
  flex: 1,
  display: "flex",
  justifyContent: "space-evenly",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
  padding: "24px",
});

export const svg = style({
  width: "256px",
  height: "256px",
  borderRadius: tokens.radius.lg,
  overflow: "hidden",
  boxShadow: generateOuterShadow("md"),
});

export const link = style({
  marginTop: "5px",
  wordBreak: "break-all",
  cursor: "pointer",

  ":hover": {
    textDecoration: "underline",
  },
});

export const footer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
});
