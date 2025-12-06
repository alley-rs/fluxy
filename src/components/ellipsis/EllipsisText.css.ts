import { style } from "@vanilla-extract/css";

export const container = style({
  display: "inline-block",
  maxWidth: "100%",
  position: "relative",
});

export const measureElement = style({
  position: "absolute",
  visibility: "hidden",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  left: "-9999px",
});
