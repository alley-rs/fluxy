import { style, styleVariants } from "@vanilla-extract/css";
import { tokens, themeContract, transitions } from "~/themes/themes.css";
import { neumorphicSurface } from "~/themes/neumorphic.css";
import { elevation } from "~/themes/neumorphic.css";
import { flex } from "~/themes/primitives.css";

// 背景遮罩
export const overlay = style([
  flex.center,
  {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: themeContract.color.overlay,
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    zIndex: tokens.zIndex.modalBackdrop,
    opacity: 0,
    transition: `opacity ${tokens.duration.slower} ${tokens.easing.easeOut}`,

    selectors: {
      '&[data-entering="true"]': {
        opacity: 1,
      },
    },
  },
]);

// 对话框容器
export const dialog = style([
  neumorphicSurface,
  elevation.floating,
  {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    maxWidth: "90vw",
    maxHeight: "90vh",
    minWidth: "300px",
    borderRadius: tokens.radius.lg,
    zIndex: tokens.zIndex.modal,
    opacity: 0,
    transform: `scale(${tokens.scale[90]})`,
    transition: `all ${tokens.duration.slower} ${tokens.easing.spring}`,
    outline: "none",

    selectors: {
      '&[data-entering="true"]': {
        opacity: 1,
        transform: "scale(1)",
      },
    },
  },
]);

// 全屏对话框样式
export const fullscreen = style({
  width: "100vw",
  height: "100vh",
  maxWidth: "100vw",
  maxHeight: "100vh",
  borderRadius: 0,
});

// 对话框头部
export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: tokens.spacing.lg,
});

// 对话框标题
export const title = style({
  fontSize: tokens.fontSize.xl,
  fontWeight: tokens.fontWeight.semibold,
  color: themeContract.color.foreground,
  margin: 0,
  flex: 1,
});

// 对话框标题居中
export const titleCentered = style({
  textAlign: "center",
  position: "absolute",
  left: 0,
  right: 0,
  margin: "auto",
  padding: `0 ${tokens.spacing.lg}`,
});

// 关闭按钮容器（用于标题居中时）
export const closeButtonContainer = style({
  position: "relative",
  zIndex: 1,
});

// 关闭按钮
export const closeButton = style({
  background: "none",
  border: "none",
  padding: tokens.spacing.xs,
  margin: `-${tokens.spacing.xs}`,
  cursor: "pointer",
  borderRadius: tokens.radius.full,
  color: themeContract.color.foreground,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: transitions.fast,

  ":hover": {
    backgroundColor: themeContract.color.neutral,
  },

  ":focus-visible": {
    outline: "2px solid",
    outlineColor: themeContract.color.primary,
    outlineOffset: "2px",
  },
});

// 对话框内容区域
export const content = style({
  padding: tokens.spacing.lg,
  flex: 1,
  overflow: "auto",
  color: themeContract.color.foreground,
});

// 对话框底部
export const footer = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: tokens.spacing.md,
  padding: `${tokens.spacing.md} ${tokens.spacing.lg}`, // 上下使用md(16px)，左右使用lg(24px)
});

// 对话框尺寸变体
export const dialogSizes = styleVariants({
  sm: {
    width: "400px",
  },
  md: {
    width: "550px",
  },
  lg: {
    width: "700px",
  },
});
