import { style, styleVariants } from "@vanilla-extract/css";
import { themeContract, tokens, transitions } from "./themes.css";
import {
  generateFocusRing,
  generateInnerShadow,
  generateOuterShadow,
  generateScrollbarGradient,
} from "./helpers";

/**
 * ============================================
 * 阴影尺寸基础乘数定义
 * 使用纯数值作为基础比例，用于动态计算最终像素值
 * ============================================
 */

/**
 * 阴影尺寸基础乘数定义 - 基于物理原理和视觉优化
 *
 * 【核心逻辑】
 * 基础单位 S = outer.lightOffset (例如 xs 尺寸 S=1, md 尺寸 S=2.5)
 *
 * 【外阴影 (凸起) - Box Shadow】
 * - lightOffset (左上高光偏移): S (基准)
 * - darkOffset (右下投影偏移): 2 * S (投影偏移更大)
 * - lightBlur (高光模糊): 1 * S (高光锐利)
 * - darkBlur (投影模糊): 4 * S (投影柔和扩散，是 offset 的 2 倍)
 *
 * 【内阴影 (凹陷) - Inner Shadow】
 * - darkOffset (左上暗边偏移): 0.5 * S (凹陷暗边极小偏移，模拟紧贴边缘的遮挡)
 * - lightOffset (右下亮边偏移): 1.5 * S (反射光，偏移适中)
 * - darkBlur (左上暗边模糊): 1.5 * S (凹陷暗边锐利)
 * - lightBlur (右下亮边模糊): 3 * S (反射光，适度柔和)
 */
export const shadowBaseRatios = {
  xs: {
    // S = 1
    outer: {
      lightOffset: 1, // S
      darkOffset: 2, // 2 * S
      lightBlur: 1, // 1 * S
      darkBlur: 4, // 4 * S
    },
    inner: {
      darkOffset: 0.5, // 0.5 * S
      lightOffset: 1.5, // 1.5 * S
      darkBlur: 1.5, // 1.5 * S
      lightBlur: 3, // 3 * S
    },
  },
  sm: {
    // S = 1.5
    outer: {
      lightOffset: 1.5, // S
      darkOffset: 3, // 2 * S
      lightBlur: 1.5, // 1 * S
      darkBlur: 6, // 4 * S
    },
    inner: {
      darkOffset: 0.75, // 0.5 * S
      lightOffset: 2.25, // 1.5 * S
      darkBlur: 2.25, // 1.5 * S
      lightBlur: 4.5, // 3 * S
    },
  },
  md: {
    // S = 2.5
    outer: {
      lightOffset: 2.5, // S
      darkOffset: 5, // 2 * S
      lightBlur: 2.5, // 1 * S
      darkBlur: 10, // 4 * S
    },
    inner: {
      darkOffset: 1.25, // 0.5 * S
      lightOffset: 3.75, // 1.5 * S
      darkBlur: 3.75, // 1.5 * S
      lightBlur: 7.5, // 3 * S
    },
  },
  lg: {
    // S = 4
    outer: {
      lightOffset: 4, // S
      darkOffset: 8, // 2 * S
      lightBlur: 4, // 1 * S
      darkBlur: 16, // 4 * S
    },
    inner: {
      darkOffset: 2, // 0.5 * S
      lightOffset: 6, // 1.5 * S
      darkBlur: 6, // 1.5 * S
      lightBlur: 12, // 3 * S
    },
  },
  xl: {
    // S = 6
    outer: {
      lightOffset: 6, // S
      darkOffset: 12, // 2 * S
      lightBlur: 6, // 1 * S
      darkBlur: 24, // 4 * S
    },
    inner: {
      darkOffset: 3, // 0.5 * S
      lightOffset: 9, // 1.5 * S
      darkBlur: 9, // 1.5 * S
      lightBlur: 18, // 3 * S
    },
  },
} as const;

/**
 * ============================================
 * 预定义的交互状态阴影
 * ============================================
 */
export const interactiveShadows = {
  default: generateOuterShadow("md"),
  hover: generateOuterShadow("lg"),
  active: generateInnerShadow("sm"),
  focus: `${generateOuterShadow("md")}, ${generateFocusRing()}`,
} as const;

/**
 * ============================================
 * 高度系统 (Elevation)
 * 不同的悬浮高度阴影
 * ============================================
 */
export const elevation = styleVariants({
  flat: {
    boxShadow: "none",
  },
  raised: {
    boxShadow: generateOuterShadow("sm"),
  },
  floating: {
    boxShadow: generateOuterShadow("md"),
  },
  elevated: {
    boxShadow: generateOuterShadow("lg"),
  },
  high: {
    boxShadow: generateOuterShadow("xl"),
  },
});

/**
 * ============================================
 * 基础轻拟物样式
 * ============================================
 */

/**
 * 轻拟物凸起表面
 * 适用于按钮、卡片等需要凸起效果的组件
 */
export const neumorphicSurface = style({
  backgroundColor: themeContract.color.surface,
  borderRadius: tokens.radius.md,
  boxShadow: generateOuterShadow("md"),
  transition: transitions.shadow,
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
});

/**
 * 轻拟物凸起表面（无默认阴影）
 * 适用于需要自定义阴影效果的组件（如按钮）
 */
export const neumorphicSurfaceNoShadow = style({
  backgroundColor: themeContract.color.surface,
  borderRadius: tokens.radius.md,
  transition: transitions.shadow,
});

/**
 * 轻拟物凹陷表面
 * 适用于输入框、文本域等需要内凹效果的组件
 */
export const neumorphicInset = style({
  backgroundColor: themeContract.color.surface,
  borderRadius: tokens.radius.md,
  boxShadow: generateInnerShadow("sm"),
  transition: transitions.shadow,
});

/**
 * 轻拟物平面（无阴影）
 * 适用于需要轻拟物背景但不需要阴影的组件
 */
export const neumorphicFlat = style({
  backgroundColor: themeContract.color.surface,
  borderRadius: tokens.radius.md,
});

/**
 * ============================================
 * 自定义滚动条
 * ============================================
 */

/**
 * 轻拟物风格的滚动条
 */
export const neumorphicScrollbar = style({
  "::-webkit-scrollbar": {
    width: "10px",
    height: "10px",
  },

  "::-webkit-scrollbar-track": {
    background: "transparent",
    margin: "5px 0",
  },

  "::-webkit-scrollbar-thumb": {
    background: generateScrollbarGradient("default"),
    borderRadius: tokens.radius.full,
    border: `1px solid ${themeContract.color.surface}`,
    transition: "all 0.3s ease",
  },

  selectors: {
    "&::-webkit-scrollbar-thumb:hover": {
      background: generateScrollbarGradient("hover"),
    },

    "&::-webkit-scrollbar-thumb:active": {
      background: generateScrollbarGradient("active"),
      boxShadow: generateInnerShadow("sm"),
    },
  },
});
