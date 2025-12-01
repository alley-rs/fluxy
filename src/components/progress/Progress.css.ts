import { style, styleVariants } from "@vanilla-extract/css";
import { tokens, themeContract } from "../../themes/themes.css";

export const progressTrack = style({
  width: "100%",
  backgroundColor: themeContract.color.surface,
  borderRadius: tokens.radius.full,
  boxShadow: `inset 2px 2px 5px ${themeContract.color.shadowDark}, inset -2px -2px 5px ${themeContract.color.shadowLight}`,
  overflow: "hidden",
});

export const progressFill = style({
  height: "100%",
  backgroundColor: themeContract.color.primary,
  borderRadius: tokens.radius.full,
  transition: "width 0.3s ease-out",
  // Optional: Add a subtle shine or gradient
  backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(0,0,0,0.1))`,
});

export const sizeVariants = styleVariants({
  sm: { height: "8px" },
  md: { height: "16px" },
  lg: { height: "24px" },
});

export const variantVariants = styleVariants({
  primary: { backgroundColor: themeContract.color.primary },
  success: { backgroundColor: themeContract.color.success },
  warning: { backgroundColor: themeContract.color.warning },
  error: { backgroundColor: themeContract.color.error },
});
