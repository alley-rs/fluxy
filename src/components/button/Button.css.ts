import { createVar, style, styleVariants } from "@vanilla-extract/css";

import { tokens, themeContract, transitions } from "~/themes/themes.css";
import {
  interactiveShadows,
  neumorphicSurfaceNoShadow,
} from "~/themes/neumorphic.css";
import {
  componentSizes,
  disabledStyles,
  flex,
  resetButton,
} from "~/themes/primitives.css";
import {
  generateInnerShadow,
  generateOuterShadow,
  generateTextShadow,
  generateTextShadowActive,
} from "~/themes/helpers";

/**
 * CSS 变量定义
 */
export const buttonShadowOuter = createVar();
export const buttonShadowInner = createVar();
export const buttonBgColor = createVar();
export const buttonTextColor = createVar();
export const buttonTextShadow = createVar();
export const buttonTextShadowActive = createVar();

/**
 * 按钮基础样式
 */
export const buttonBase = style([
  resetButton,
  neumorphicSurfaceNoShadow,
  flex.center,
  {
    fontWeight: tokens.fontWeight.medium,
    transition: transitions.base,
    userSelect: "none",
    cursor: "pointer",
    backgroundColor: buttonBgColor,
    color: buttonTextColor,
    boxShadow: buttonShadowOuter,
    textShadow: buttonTextShadow,

    selectors: {
      "&:active:not(:disabled)": {
        transform: `scale(${tokens.scale[95]})`,
        boxShadow: buttonShadowInner,
        textShadow: buttonTextShadowActive,
      },

      "&:hover": {
        transform: `scale(${tokens.scale[105]})`,
      },

      "&:focus-visible": {
        boxShadow: interactiveShadows.focus,
      },

      "&:disabled": disabledStyles,
    },
  },
]);

/**
 * 按钮尺寸变体
 */
export const buttonSizes = styleVariants({
  xs: [buttonBase, componentSizes.xs],
  sm: [buttonBase, componentSizes.sm],
  md: [buttonBase, componentSizes.md],
  lg: [buttonBase, componentSizes.lg],
  xl: [buttonBase, componentSizes.xl],
});

/**
 * 按钮变体样式配置（用于生成 CSS 变量值）
 */
export const buttonVariantVars = {
  primary: {
    sm: {
      [buttonBgColor]: themeContract.color.primary,
      [buttonTextColor]: themeContract.color.neutralForegroundStaticInverted,
      [buttonShadowOuter]: generateOuterShadow("sm", {
        baseSize: "0.5px",
        colorType: "primary",
        inner: { edge: true },
      }),
      [buttonShadowInner]: generateInnerShadow("sm", {
        colorType: "primary",
      }),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
    md: {
      [buttonBgColor]: themeContract.color.primary,
      [buttonTextColor]: themeContract.color.neutralForegroundStaticInverted,
      [buttonShadowOuter]: generateOuterShadow("md", {
        baseSize: "0.5px",
        colorType: "primary",
        inner: { edge: true },
      }),
      [buttonShadowInner]: generateInnerShadow("md", {
        colorType: "primary",
      }),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
    lg: {
      [buttonBgColor]: themeContract.color.primary,
      [buttonTextColor]: themeContract.color.neutralForegroundStaticInverted,
      [buttonShadowOuter]: generateOuterShadow("lg", {
        baseSize: "0.5px",
        colorType: "primary",
        inner: { edge: true },
      }),
      [buttonShadowInner]: generateInnerShadow("lg", {
        colorType: "primary",
      }),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
  },

  secondary: {
    sm: {
      [buttonBgColor]: themeContract.color.surface,
      [buttonTextColor]: themeContract.color.foreground,
      [buttonShadowOuter]: generateOuterShadow("sm", {
        baseSize: "0.5px",
      }),
      [buttonShadowInner]: generateInnerShadow("sm"),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
    md: {
      [buttonBgColor]: themeContract.color.surface,
      [buttonTextColor]: themeContract.color.foreground,
      [buttonShadowOuter]: generateOuterShadow("md", {
        baseSize: "0.75px",
      }),
      [buttonShadowInner]: generateInnerShadow("md"),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
    lg: {
      [buttonBgColor]: themeContract.color.surface,
      [buttonTextColor]: themeContract.color.foreground,
      [buttonShadowOuter]: generateOuterShadow("lg", {
        baseSize: "0.5px",
        inner: { edge: true },
      }),
      [buttonShadowInner]: generateInnerShadow("lg"),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
  },

  danger: {
    sm: {
      [buttonBgColor]: themeContract.color.error,
      [buttonTextColor]: themeContract.color.neutralForegroundStaticInverted,
      [buttonShadowOuter]: generateOuterShadow("sm", {
        baseSize: "0.5px",
        colorType: "error",
      }),
      [buttonShadowInner]: generateInnerShadow("sm", {
        colorType: "error",
      }),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
    md: {
      [buttonBgColor]: themeContract.color.error,
      [buttonTextColor]: themeContract.color.neutralForegroundStaticInverted,
      [buttonShadowOuter]: generateOuterShadow("md", {
        baseSize: "0.75px",
        colorType: "error",
      }),
      [buttonShadowInner]: generateInnerShadow("md", {
        colorType: "error",
      }),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
    lg: {
      [buttonBgColor]: themeContract.color.error,
      [buttonTextColor]: themeContract.color.neutralForegroundStaticInverted,
      [buttonShadowOuter]: generateOuterShadow("lg", {
        baseSize: "0.5px",
        colorType: "error",
        inner: { edge: true },
      }),
      [buttonShadowInner]: generateInnerShadow("lg", {
        colorType: "error",
      }),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
  },

  ghost: {
    sm: {
      [buttonBgColor]: "transparent",
      [buttonTextColor]: themeContract.color.foreground,
      [buttonShadowOuter]: "none",
      [buttonShadowInner]: generateInnerShadow("sm"),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
    md: {
      [buttonBgColor]: "transparent",
      [buttonTextColor]: themeContract.color.foreground,
      [buttonShadowOuter]: "none",
      [buttonShadowInner]: generateInnerShadow("md"),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
    lg: {
      [buttonBgColor]: "transparent",
      [buttonTextColor]: themeContract.color.foreground,
      [buttonShadowOuter]: "none",
      [buttonShadowInner]: generateInnerShadow("lg"),
      [buttonTextShadow]: "none",
      [buttonTextShadowActive]: "none",
    },
  },

  text: {
    sm: {
      [buttonBgColor]: "transparent",
      [buttonTextColor]: themeContract.color.primary,
      [buttonShadowOuter]: "none",
      [buttonShadowInner]: "none",
      [buttonTextShadow]: generateTextShadow("0.5px"),
      [buttonTextShadowActive]: generateTextShadowActive("0.5px"),
    },
    md: {
      [buttonBgColor]: "transparent",
      [buttonTextColor]: themeContract.color.primary,
      [buttonShadowOuter]: "none",
      [buttonShadowInner]: "none",
      [buttonTextShadow]: generateTextShadow(),
      [buttonTextShadowActive]: generateTextShadowActive(),
    },
    lg: {
      [buttonBgColor]: "transparent",
      [buttonTextColor]: themeContract.color.primary,
      [buttonShadowOuter]: "none",
      [buttonShadowInner]: "none",
      [buttonTextShadow]: generateTextShadow("1.5px"),
      [buttonTextShadowActive]: generateTextShadowActive("1.5px"),
    },
  },
} as const;

/**
 * 生成组合样式类
 * 例如: primary-sm, primary-md, secondary-lg 等
 */
export const buttonVariantSize = styleVariants(
  Object.entries(buttonVariantVars).reduce((acc, [variant, sizes]) => {
    Object.entries(sizes).forEach(([size, vars]) => {
      acc[`${variant}-${size}`] = { vars };
    });
    return acc;
  }, {} as Record<string, { vars: Record<string, string> }>)
);

// 图标按钮
export const iconOnly = style({
  aspectRatio: "1",
  padding: 0,
});

// 按钮形状
export const buttonShape = styleVariants({
  circle: { borderRadius: tokens.radius.full },
  rounded: { borderRadius: tokens.radius.md },
  square: { borderRadius: tokens.radius.none },
});
