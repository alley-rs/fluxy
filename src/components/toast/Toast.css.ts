import { style, styleVariants } from "@vanilla-extract/css";
import { themeContract } from "../../themes/themes.css";
import { tokens } from "../../themes/themes.css";

// Position variants for the container wrappers
const positionBase = style({
  position: "fixed",
  display: "flex",
  flexDirection: "column",
  gap: tokens.spacing.md,
  padding: tokens.spacing.md,
  pointerEvents: "none",
  zIndex: 9999,
  maxWidth: "100%",
  width: "auto",
  // Mobile adaptation
  "@media": {
    "(max-width: 600px)": {
      left: "50%",
      transform: "translateX(-50%)",
      width: "90%",
      padding: tokens.spacing.sm,
    },
  },
});

export const positionWrapper = styleVariants({
  top: [positionBase, { top: 0, left: "50%", transform: "translateX(-50%)" }],
  "top-start": [positionBase, { top: 0, left: 0, alignItems: "flex-start" }],
  "top-end": [positionBase, { top: 0, right: 0, alignItems: "flex-end" }],
  bottom: [
    positionBase,
    {
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      flexDirection: "column-reverse",
    },
  ],
  "bottom-start": [
    positionBase,
    {
      bottom: 0,
      left: 0,
      alignItems: "flex-start",
      flexDirection: "column-reverse",
    },
  ],
  "bottom-end": [
    positionBase,
    {
      bottom: 0,
      right: 0,
      alignItems: "flex-end",
      flexDirection: "column-reverse",
    },
  ],
  left: [
    positionBase,
    {
      top: "50%",
      left: 0,
      transform: "translateY(-50%)",
      alignItems: "flex-start",
    },
  ],
  "left-start": [positionBase, { top: 0, left: 0, alignItems: "flex-start" }],
  "left-end": [
    positionBase,
    {
      bottom: 0,
      left: 0,
      alignItems: "flex-start",
      flexDirection: "column-reverse",
    },
  ],
  right: [
    positionBase,
    {
      top: "50%",
      right: 0,
      transform: "translateY(-50%)",
      alignItems: "flex-end",
    },
  ],
  "right-start": [positionBase, { top: 0, right: 0, alignItems: "flex-end" }],
  "right-end": [
    positionBase,
    {
      bottom: 0,
      right: 0,
      alignItems: "flex-end",
      flexDirection: "column-reverse",
    },
  ],
});

// Toast Styles
export const toastBase = style({
  pointerEvents: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: "300px",
  maxWidth: "400px",
  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
  borderRadius: tokens.radius.lg,
  fontSize: tokens.fontSize.sm,
  fontWeight: tokens.fontWeight.medium,
  color: themeContract.color.foreground,
  background: themeContract.color.surface,

  // Light Neumorphism Effect
  boxShadow: `
      6px 6px 12px ${themeContract.color.shadowDark},
      -6px -6px 12px ${themeContract.color.shadowLight}
    `,
  border: `1px solid rgba(255, 255, 255, 0.1)`,

  transition: "all 0.3s ease",
  opacity: 0,
  transform: "scale(0.9)",

  // Mobile adaptation
  "@media": {
    "(max-width: 600px)": {
      minWidth: "auto",
      width: "100%",
    },
  },
});

export const toastType = styleVariants({
  info: {
    borderLeft: `${tokens.borderWidth.lg} solid ${themeContract.color.primary}`,
  },
  success: {
    borderLeft: `${tokens.borderWidth.lg} solid ${themeContract.color.success}`,
  },
  warning: {
    borderLeft: `${tokens.borderWidth.lg} solid ${themeContract.color.warning}`,
  },
  error: {
    borderLeft: `${tokens.borderWidth.lg} solid ${themeContract.color.error}`,
  },
  default: {
    borderLeft: `${tokens.borderWidth.lg} solid ${themeContract.color.secondary}`,
  },
});

export const toastVisible = styleVariants({
  true: {
    opacity: 1,
    transform: "scale(1) translateY(0)",
  },
  false: {
    opacity: 0,
    transform: "scale(0.9) translateY(10px)",
  },
});

export const content = style({
  flex: 1,
  marginRight: tokens.spacing.md,
  lineHeight: 1.5,
});

const typeIconBase = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: tokens.spacing.md,
  fontSize: tokens.fontSize.lg,
});

export const typeIcon = styleVariants({
  info: [typeIconBase, { color: themeContract.color.primary }],
  success: [typeIconBase, { color: themeContract.color.success }],
  warning: [typeIconBase, { color: themeContract.color.warning }],
  error: [typeIconBase, { color: themeContract.color.error }],
  default: [typeIconBase, { color: themeContract.color.secondary }],
});
