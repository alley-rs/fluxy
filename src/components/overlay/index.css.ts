import { style } from "@vanilla-extract/css";
import { themeContract } from "~/themes/themes.css";

export const overlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: themeContract.color.overlay,
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  zIndex: 9999,
  pointerEvents: "none",
});
