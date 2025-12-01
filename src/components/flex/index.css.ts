import { style, styleVariants } from "@vanilla-extract/css";

export const flex = style({
  display: "flex",
});

export const gapVariants = styleVariants({
  sm: { gap: "8px" },
  md: { gap: "16px" },
  lg: { gap: "24px" },
});

export const inline = style({
  display: "inline-flex",
});

export const directionVariants = styleVariants({
  horizontal: {
    flexDirection: "row",
  },
  vertical: {
    flexDirection: "column",
  },
});

export const justifyVariants = styleVariants({
  normal: {},
  center: { justifyContent: "center" },
  start: { justifyContent: "flex-start" },
  end: { justifyContent: "flex-end" },
  round: { justifyContent: "round" },
  between: { justifyContent: "space-between" },
  stretch: { justifyContent: "stretch" },
  evenly: { justifyContent: "space-evenly" },
});

export const alignVariants = styleVariants({
  normal: {},
  center: { alignItems: "center" },
  start: { alignItems: "flex-start" },
  end: { alignItems: "flex-end" },
});

export const wrapVariants = styleVariants({
  wrap: { flexWrap: "wrap" },
  nowrap: { flexWrap: "nowrap" },
  "wrap-reverse": { flexWrap: "wrap-reverse" },
});
