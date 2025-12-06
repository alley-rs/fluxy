import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { tokens, themeContract } from "./themes.css";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
});

globalStyle("html, body", {
  minHeight: "100vh",
  fontFamily: tokens.fontFamily.system,
  fontSize: tokens.fontSize.md,
  lineHeight: 1.6,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
});

globalStyle("body", {
  backgroundColor: themeContract.color.background,
  backdropFilter: "blur(12px) saturate(1.2)",
  WebkitBackdropFilter: "blur(20px) saturate(1.2)" /* Safari 兼容 */,
  color: themeContract.color.foreground,
  transition: "all 0.3s ease",
  overflow: "hidden",
});

// 高斯模糊背景
globalStyle("body::before", {
  content: '""',
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -2,
  background: `
    radial-gradient(circle at 20% 30%, ${themeContract.color.primary}40 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, ${themeContract.color.secondary}30 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, ${themeContract.color.success}20 0%, transparent 60%)
  `,
  filter: "blur(80px)",
});

globalStyle("body::after", {
  content: '""',
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: `linear-gradient(135deg, ${themeContract.color.background} 0%, ${themeContract.color.primary}15 100%)`,
  opacity: 0.85,
});

// Spinner 动画

const spin = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const spinner = style({
  width: "16px",
  height: "16px",
  border: "2px solid currentColor",
  borderTopColor: "transparent",
  borderRadius: "50%",
  animation: `${spin} 0.6s linear infinite`,
});

globalStyle(".spinner", {
  width: "16px",
  height: "16px",
  border: "2px solid currentColor",
  borderTopColor: "transparent",
  borderRadius: "50%",
  animation: `${spin} 0.6s linear infinite`,
});
