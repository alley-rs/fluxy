import { style, styleVariants } from "@vanilla-extract/css";
import { tokens, themeContract, transitions } from "./themes.css";
import { neumorphicSurface, neumorphicInset } from "./neumorphic.css";
import {
  generateFocusRing,
  generateInnerShadow,
  generateOuterShadow,
} from "./helpers";

/**
 * ============================================
 * 组件尺寸系统
 * ============================================
 */

/**
 * 按钮/输入框/标签等组件的标准尺寸
 */
export const componentSizes = {
  xs: {
    height: "24px",
    padding: `0 ${tokens.spacing.xs}`,
    fontSize: tokens.fontSize.xs,
    borderRadius: tokens.radius.sm,
    gap: tokens.spacing.xs,
  },
  sm: {
    height: "32px",
    padding: `0 ${tokens.spacing.sm}`,
    fontSize: tokens.fontSize.sm,
    borderRadius: tokens.radius.sm,
    gap: tokens.spacing.xs,
  },
  md: {
    height: "40px",
    padding: `0 ${tokens.spacing.md}`,
    fontSize: tokens.fontSize.md,
    borderRadius: tokens.radius.md,
    gap: tokens.spacing.sm,
  },
  lg: {
    height: "48px",
    padding: `0 ${tokens.spacing.lg}`,
    fontSize: tokens.fontSize.lg,
    borderRadius: tokens.radius.md,
    gap: tokens.spacing.sm,
  },
  xl: {
    height: "56px",
    padding: `0 ${tokens.spacing.xl}`,
    fontSize: tokens.fontSize.xl,
    borderRadius: tokens.radius.lg,
    gap: tokens.spacing.md,
  },
} as const;

/**
 * 图标尺寸系统
 */
export const iconSizes = {
  xs: { width: "12px", height: "12px" },
  sm: { width: "16px", height: "16px" },
  md: { width: "20px", height: "20px" },
  lg: { width: "24px", height: "24px" },
  xl: { width: "32px", height: "32px" },
  xxl: { width: "48px", height: "48px" },
} as const;

/**
 * ============================================
 * 重置样式
 * ============================================
 */

/**
 * 重置按钮样式
 */
export const resetButton = style({
  border: "none",
  background: "none",
  padding: 0,
  margin: 0,
  font: "inherit",
  color: "inherit",
  cursor: "pointer",
  outline: "none",
  WebkitTapHighlightColor: "transparent",
});

/**
 * 重置输入框样式
 */
export const resetInput = style({
  border: "none",
  background: "none",
  padding: 0,
  margin: 0,
  font: "inherit",
  color: "inherit",
  outline: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
});

/**
 * 重置列表样式
 */
export const resetList = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
});

/**
 * ============================================
 * 状态样式
 * ============================================
 */

/**
 * 禁用状态
 */
export const disabledStyles = {
  opacity: tokens.opacity.medium,
  cursor: "not-allowed",
  pointerEvents: "none" as const,
};

/**
 * 加载状态
 */
export const loadingStyles = {
  opacity: tokens.opacity.high,
  cursor: "wait",
  pointerEvents: "none" as const,
};

/**
 * ============================================
 * 文本工具
 * ============================================
 */

/**
 * 单行文本截断
 */
export const textTruncate = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

/**
 * 文本居中
 */
export const textCenter = style({
  textAlign: "center",
});

/**
 * 文本选择禁用
 */
export const noSelect = style({
  userSelect: "none",
  WebkitUserSelect: "none",
});

/**
 * ============================================
 * Flexbox 布局
 * ============================================
 */

export const flex = {
  /**
   * 水平垂直居中
   */
  center: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),

  /**
   * 垂直居中
   */
  centerY: style({
    display: "flex",
    alignItems: "center",
  }),

  /**
   * 水平居中
   */
  centerX: style({
    display: "flex",
    justifyContent: "center",
  }),

  /**
   * 两端对齐
   */
  between: style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),

  /**
   * 均匀分布
   */
  around: style({
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  }),

  /**
   * 列布局
   */
  column: style({
    display: "flex",
    flexDirection: "column",
  }),

  /**
   * 列布局 + 居中
   */
  columnCenter: style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }),

  /**
   * 自动换行
   */
  wrap: style({
    display: "flex",
    flexWrap: "wrap",
  }),

  /**
   * 行内 flex
   */
  inline: style({
    display: "inline-flex",
    alignItems: "center",
  }),
} as const;

/**
 * ============================================
 * Grid 布局
 * ============================================
 */

export const grid = {
  /**
   * 基础 grid
   */
  base: style({
    display: "grid",
  }),

  /**
   * 2 列网格
   */
  cols2: style({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: tokens.spacing.md,
  }),

  /**
   * 3 列网格
   */
  cols3: style({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: tokens.spacing.md,
  }),

  /**
   * 4 列网格
   */
  cols4: style({
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: tokens.spacing.md,
  }),

  /**
   * 响应式网格 (自动填充)
   */
  responsive: style({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: tokens.spacing.md,
  }),

  /**
   * 居中网格
   */
  center: style({
    display: "grid",
    placeItems: "center",
  }),
} as const;

/**
 * ============================================
 * 可访问性
 * ============================================
 */

/**
 * 视觉隐藏 (对屏幕阅读器可见)
 */
export const visuallyHidden = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
});

/**
 * 焦点可见样式
 */
export const focusVisible = style({
  selectors: {
    "&:focus-visible": {
      outline: `${tokens.borderWidth.md} solid ${themeContract.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

/**
 * ============================================
 * 基础组件样式
 * ============================================
 */

/**
 * 输入框基础样式
 */
export const inputBase = style([
  resetInput,
  neumorphicInset,
  {
    width: "100%",
    backgroundColor: themeContract.color.surface,
    color: themeContract.color.foreground,
    fontFamily: tokens.fontFamily.system,
    fontSize: tokens.fontSize.md,
    padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
    transition: transitions.shadow,

    "::placeholder": {
      color: themeContract.color.secondary,
      opacity: tokens.opacity.medium,
    },

    ":focus": {
      boxShadow: `${generateInnerShadow("sm")}, ${generateFocusRing()}`,
    },

    ":disabled": disabledStyles,
  },
]);

/**
 * 输入框尺寸变体
 */
export const inputSizes = styleVariants({
  sm: {
    height: componentSizes.sm.height,
    fontSize: componentSizes.sm.fontSize,
  },
  md: {
    height: componentSizes.md.height,
    fontSize: componentSizes.md.fontSize,
  },
  lg: {
    height: componentSizes.lg.height,
    fontSize: componentSizes.lg.fontSize,
  },
});

/**
 * 文本域基础样式
 */
export const textareaBase = style([
  inputBase,
  {
    minHeight: "80px",
    resize: "vertical",
    lineHeight: tokens.lineHeight.relaxed,
  },
]);

/**
 * 卡片基础样式
 */
export const cardBase = style([
  neumorphicSurface,
  {
    padding: tokens.spacing.lg,
    transition: `${transitions.shadow}, ${transitions.transform}`,

    ":hover": {
      boxShadow: generateOuterShadow("lg"),
      transform: `translateY(-2px)`,
    },
  },
]);

/**
 * 标签/徽章基础样式
 */
export const badgeBase = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
  fontSize: tokens.fontSize.xs,
  fontWeight: tokens.fontWeight.medium,
  borderRadius: tokens.radius.full,
  backgroundColor: themeContract.color.neutral,
  color: themeContract.color.surface,
  whiteSpace: "nowrap",
});

/**
 * 容器样式
 */
export const container = style({
  width: "100%",
  maxWidth: "1280px",
  margin: "0 auto",
  padding: `0 ${tokens.spacing.lg}`,
});

/**
 * 遮罩层
 */
export const overlay = style({
  position: "fixed",
  inset: 0,
  backgroundColor: themeContract.color.overlay,
  backdropFilter: `blur(${tokens.blur.sm})`,
  zIndex: tokens.zIndex.modalBackdrop,
});

/**
 * ============================================
 * 间距工具类
 * ============================================
 */

/**
 * Padding 变体
 */
export const padding = styleVariants({
  xs: { padding: tokens.spacing.xs },
  sm: { padding: tokens.spacing.sm },
  md: { padding: tokens.spacing.md },
  lg: { padding: tokens.spacing.lg },
  xl: { padding: tokens.spacing.xl },
  xxl: { padding: tokens.spacing.xxl },
});

/**
 * Margin 变体
 */
export const margin = styleVariants({
  xs: { margin: tokens.spacing.xs },
  sm: { margin: tokens.spacing.sm },
  md: { margin: tokens.spacing.md },
  lg: { margin: tokens.spacing.lg },
  xl: { margin: tokens.spacing.xl },
  xxl: { margin: tokens.spacing.xxl },
});

/**
 * Gap 变体 (用于 flex/grid)
 */
export const gap = styleVariants({
  xs: { gap: tokens.spacing.xs },
  sm: { gap: tokens.spacing.sm },
  md: { gap: tokens.spacing.md },
  lg: { gap: tokens.spacing.lg },
  xl: { gap: tokens.spacing.xl },
  xxl: { gap: tokens.spacing.xxl },
});
