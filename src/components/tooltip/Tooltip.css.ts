import { style, keyframes, createVar } from "@vanilla-extract/css";
import { tokens, themeContract } from "../../themes/themes.css";

const fadeIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0.95)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

const fadeOut = keyframes({
  "0%": { opacity: 1, transform: "scale(1)" },
  "100%": { opacity: 0, transform: "scale(0.95)" },
});

// Container uses display: contents to avoid affecting layout
export const container = style({
  display: "contents",
});

export const tooltipContent = style({
  position: "fixed", // Changed to fixed for Portal positioning relative to viewport
  zIndex: 1000,
  maxWidth: "320px",
  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
  borderRadius: tokens.radius.md,
  backgroundColor: themeContract.color.surface,
  color: themeContract.color.foreground,
  fontSize: tokens.fontSize.sm,
  fontWeight: tokens.fontWeight.medium,
  pointerEvents: "none",
  wordBreak: "break-all",
  boxShadow: `${themeContract.color.shadowLight} -2px -2px 4px, ${themeContract.color.shadowDark} 3px 3px 8px`,
  border: `1px solid ${themeContract.color.background}`,
  transition: "opacity 0.2s ease, transform 0.2s ease",
  opacity: 0,
  visibility: "hidden",
  // Initial top/left will be set by JS, but we can default to top-left to avoid jumps
  top: 0,
  left: 0,
});

export const tooltipVisible = style({
  opacity: 1,
  pointerEvents: "auto",
  visibility: "visible",
  animation: `${fadeIn} 0.2s ease forwards`,
});

export const tooltipHidden = style({
  opacity: 0,
  pointerEvents: "none",
  visibility: "hidden",
  animation: `${fadeOut} 0.2s ease forwards`,
});

const arrowOffset = createVar();
const arrowShadow = createVar();

export const arrow = style({
  vars: {
    [arrowOffset]: "-4.242px",
  },

  position: "absolute",
  width: "8px",
  height: "8px",
  backgroundColor: themeContract.color.surface,
  transform: `rotate(45deg)`,
  boxShadow: arrowShadow,
  zIndex: -1,

  selectors: {
    '[data-tooltip-position^="top"] &': {
      vars: {
        [arrowShadow]: `${themeContract.color.shadowDark} 1px 1px 2px`,
      },
      bottom: arrowOffset,
    },
    '[data-tooltip-position^="right"] &': {
      vars: {
        [arrowShadow]: `${themeContract.color.shadowLight} -2px 1px 2px`,
      },
      left: arrowOffset,
    },
    '[data-tooltip-position^="bottom"] &': {
      vars: {
        [arrowShadow]: `${themeContract.color.shadowLight} -1px -1px 2px`,
      },
      top: arrowOffset,
    },
    '[data-tooltip-position^="left"] &': {
      vars: {
        [arrowShadow]: `${themeContract.color.shadowDark} 2px -1px 2px`,
      },
      right: arrowOffset,
    },
  },
});
