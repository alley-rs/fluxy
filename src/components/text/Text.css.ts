import { style, styleVariants } from "@vanilla-extract/css";
import { generateTextShadow } from "~/themes/helpers";
import { tokens } from "~/themes/themes.css";
import { themeContract } from "~/themes/themes.css";

// 文本基础样式
export const textBase = style({
  margin: 0,
  padding: 0,
  color: themeContract.color.foreground,
  fontFamily: tokens.fontFamily.system,
});

// 文本类型变体
export const textVariants = styleVariants({
  // 标题类型
  h1: {
    fontSize: tokens.fontSize.xxxxl,
    fontWeight: tokens.fontWeight.bold,
    lineHeight: tokens.lineHeight.tight,
    textShadow: generateTextShadow("2px"),
  },
  h2: {
    fontSize: tokens.fontSize.xxxl,
    fontWeight: tokens.fontWeight.semibold,
    lineHeight: tokens.lineHeight.snug,
    textShadow: generateTextShadow("1.5px"),
  },
  h3: {
    fontSize: tokens.fontSize.xxl,
    fontWeight: tokens.fontWeight.semibold,
    lineHeight: tokens.lineHeight.normal,
    textShadow: generateTextShadow("1px"),
  },
  h4: {
    fontSize: tokens.fontSize.xl,
    fontWeight: tokens.fontWeight.semibold,
    lineHeight: tokens.lineHeight.normal,
    textShadow: generateTextShadow("0.5px"),
  },
  h5: {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.medium,
    lineHeight: tokens.lineHeight.normal,
    textShadow: generateTextShadow("0.3px"),
  },

  // 正文类型
  body: {
    fontSize: tokens.fontSize.md,
    fontWeight: tokens.fontWeight.normal,
    lineHeight: tokens.lineHeight.relaxed,
  },
  caption: {
    fontSize: tokens.fontSize.sm,
    fontWeight: tokens.fontWeight.normal,
    lineHeight: tokens.lineHeight.snug,
    color: themeContract.color.secondary,
  },

  // 副标题类型
  subtitle: {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.medium,
    lineHeight: tokens.lineHeight.snug,
    color: themeContract.color.secondary,
  },

  // 小字说明
  small: {
    fontSize: tokens.fontSize.xs,
    fontWeight: tokens.fontWeight.normal,
    lineHeight: tokens.lineHeight.tight,
    color: themeContract.color.secondary,
  },
});
