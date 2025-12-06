import { style, styleVariants } from "@vanilla-extract/css";
import { tokens, themeContract } from "../../themes/themes.css";

export const cardBase = style({
  backgroundColor: themeContract.color.surface,
  borderRadius: tokens.radius.lg,
  color: themeContract.color.foreground,
  position: "relative",
  transition: "all 0.3s ease",
  boxShadow: `${themeContract.color.shadowLight1} -5px -5px 10px, ${themeContract.color.shadowDark1} 5px 5px 10px`,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden", // Ensures content respects border radius
});

export const cardPadding = styleVariants({
  none: { padding: 0 },
  sm: { padding: tokens.spacing.sm },
  md: { padding: tokens.spacing.md },
  lg: { padding: tokens.spacing.lg },
  xl: { padding: tokens.spacing.xl },
});

export const cardHoverable = style({
  ":hover": {
    transform: "translateY(-4px)",
    boxShadow: `${themeContract.color.shadowLight1} -8px -8px 16px, ${themeContract.color.shadowDark1} 8px 8px 16px`,
  },
});

export const cardHeader = style({
  marginBottom: tokens.spacing.md,
});

export const cardTitle = style({
  fontSize: tokens.fontSize.lg,
  fontWeight: tokens.fontWeight.semibold,
  margin: 0,
  color: themeContract.color.foreground,
});

export const cardSubtitle = style({
  fontSize: tokens.fontSize.sm,
  color: themeContract.color.secondary,
  marginTop: tokens.spacing.xs,
  marginBottom: 0,
});
