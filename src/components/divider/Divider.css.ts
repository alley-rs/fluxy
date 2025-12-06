import { style, styleVariants } from "@vanilla-extract/css";
import { themeContract, tokens } from "~/themes/themes.css";
import { generateOuterShadow, type ShadowSize } from "~/themes/helpers";

/**
 * 分隔线基础样式
 */
export const dividerBase = style({
  border: "none",
  margin: 0,
  flexShrink: 0,
  position: "relative",
  "::before": {
    content: "''",
    backgroundColor: themeContract.color.neutralBorder2,
  },
});

/**
 * 水平分隔线
 */
export const horizontal = style({
  width: "100%",
  height: "1px",
  "::before": {
    width: "100%",
    height: "100%",
  },
});

/**
 * 垂直分隔线
 */
export const vertical = style({
  flexDirection: "column",
  width: "1px",
  height: "100%",
  minHeight: "1em",
  "::before": {
    width: "100%",
    height: "100%",
  },
});

/**
 * 分隔线尺寸变体
 */
export const dividerVariants = styleVariants({
  sm: {
    height: "1px",
    borderRadius: "0.5px",
  },
  md: {
    height: "2px",
    borderRadius: "1px",
  },
  lg: {
    height: "4px",
    borderRadius: "2px",
  },
});

/**
 * 垂直分隔线尺寸变体
 */
export const verticalVariants = styleVariants({
  sm: {
    width: "1px",
  },
  md: {
    width: "2px",
  },
  lg: {
    width: "4px",
  },
});

const divierBoxShadow = (size: ShadowSize = "xs", baseSize: number = 0.5) =>
  generateOuterShadow(size, {
    baseSize: `${baseSize}px`,
    inner: {
      highlight: true,
      edge: true,
    },
  });

/**
 * 分隔线尺寸样式变体
 */
export const dividerSizeStyles = styleVariants({
  sm: {
    boxShadow: divierBoxShadow(),
  },
  md: {
    boxShadow: divierBoxShadow("xs", 1),
  },
  lg: {
    boxShadow: divierBoxShadow("sm"),
  },
});

/**
 * 带文字的分隔线容器
 */
export const withTextContainer = style({
  display: "flex",
  alignItems: "center",
  width: "100%",

  "::before": {
    boxShadow: divierBoxShadow(),
  },

  "::after": {
    boxShadow: divierBoxShadow(),
  },
});

/**
 * 带文字的分隔线容器 - 水平方向
 */
export const withTextHorizontal = style({
  flexDirection: "row",
});

/**
 * 带文字的分隔线容器 - 垂直方向
 */
export const withTextVertical = style({
  flexDirection: "column",
  height: "100%",
});

const pseudoElementBase = {
  content: "''",
  backgroundColor: themeContract.color.neutralBorder2,
};

/**
 * 带文字的分隔线容器 - 水平方向 - 文字位置变体
 */
export const withTextHorizontalPosition = styleVariants({
  start: {
    "::before": {
      ...pseudoElementBase,
      height: "1px",
      width: "1em", // 固定宽度，避开文字区域
    },
    "::after": {
      ...pseudoElementBase,
      height: "1px",
      flex: 1,
    },
  },
  center: {
    "::before": {
      ...pseudoElementBase,
      height: "1px",
      flex: 1,
    },
    "::after": {
      ...pseudoElementBase,
      height: "1px",
      flex: 1,
    },
  },
  end: {
    "::before": {
      ...pseudoElementBase,
      height: "1px",
      flex: 1,
    },
    "::after": {
      ...pseudoElementBase,
      height: "1px",
      width: "1em", // 固定宽度，避开文字区域
    },
  },
});

/**
 * 带文字的分隔线容器 - 垂直方向 - 文字位置变体
 */
export const withTextVerticalPosition = styleVariants({
  start: {
    "::before": {
      ...pseudoElementBase,
      width: "1px",
      height: "1em", // 固定高度，避开文字区域
    },
    "::after": {
      ...pseudoElementBase,
      width: "1px",
      flex: 1,
    },
  },
  center: {
    "::before": {
      ...pseudoElementBase,
      width: "1px",
      flex: 1,
    },
    "::after": {
      ...pseudoElementBase,
      width: "1px",
      flex: 1,
    },
  },
  end: {
    "::before": {
      ...pseudoElementBase,
      width: "1px",
      flex: 1,
    },
    "::after": {
      ...pseudoElementBase,
      width: "1px",
      height: "1em", // 固定高度，避开文字区域
    },
  },
});

/**
 * 带文字的分隔线文字
 */
export const withTextContent = style({
  padding: `0 ${tokens.spacing.md}`,
  color: themeContract.color.secondary,
  fontSize: tokens.fontSize.sm,
  fontWeight: tokens.fontWeight.medium,
  whiteSpace: "nowrap",
  textAlign: "center",
});
