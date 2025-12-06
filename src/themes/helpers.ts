import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

import { themeContract } from "./themes.css";
import { shadowBaseRatios } from "./neumorphic.css";

/**
 * ============================================
 * 类型导出
 * ============================================
 */
export type ColorType =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

/**
 * ============================================
 * 类型定义
 * ============================================
 */
export type ShadowSize = keyof typeof shadowBaseRatios;

// 定义一个通用的回退基准尺寸
const FALLBACK_BASE_SIZE = "1px";

/**
 * ============================================
 * 阴影生成函数
 * ============================================
 */

interface BaseShadowOptions {
  /**
   * 用于计算阴影偏移和模糊的基础尺寸
   * @default "1px"
   */
  baseSize?: string;
  /**
   * 阴影颜色类型
   * @default "default"
   */
  colorType?: ColorType | "default";
}

/**
 * 安全获取主题颜色
 */
const getShadowColor = (
  colorType: ColorType | "default",
  variant: "Light" | "Dark"
): string => {
  const key =
    colorType === "default"
      ? `shadow${variant}`
      : `${colorType}Shadow${variant}`;

  if (!(key in themeContract.color)) {
    console.warn(`[Shadow] Color '${key}' not found, using default`);
    return themeContract.color[`shadow${variant}1`];
  }

  return themeContract.color[key as keyof typeof themeContract.color];
};

/**
 * 验证并获取阴影比例配置
 */
const getShadowRatios = (size: ShadowSize) => {
  if (!shadowBaseRatios[size]) {
    throw new Error(
      `[Shadow] Invalid size '${size}'. Available: ${Object.keys(
        shadowBaseRatios
      ).join(", ")}`
    );
  }
  return shadowBaseRatios[size];
};

interface OuterShadowInnerOptions {
  /**
   * 内阴影的强度系数 (仅当 highlight 或 edge 启用时生效)
   * @default 0.6
   */
  intensity?: number;
  /**
   * 在左上角内侧添加小范围高光内阴影,增强立体感
   * @default false
   */
  highlight?: boolean;
  /**
   * 在右下角内侧添加小范围暗色内阴影,增强边缘深度
   * @default false
   */
  edge?: boolean;
}

interface OuterShadowOptions extends BaseShadowOptions {
  /**
   * 禁用特定方向的外阴影
   * - 'left': 禁用左侧浅色阴影
   * - 'top': 禁用顶部浅色阴影
   * - 'right': 禁用右侧深色阴影
   * - 'bottom': 禁用底部深色阴影
   */
  disableShadows?: Array<"left" | "top" | "right" | "bottom">;
  /**
   * 外阴影内部边缘增强
   */
  inner?: OuterShadowInnerOptions;
}

/**
 * 生成轻拟物外阴影 (凸起效果)
 *
 * 光源来自左上角:
 * - 左上方: 浅色阴影 (高光)
 * - 右下方: 深色阴影 (投影)
 * - 可选: 左上内侧高光 + 右下内侧暗边,增强立体感
 *
 * @example
 * // 标准凸起效果
 * boxShadow: generateOuterShadow('md');
 *
 * @example
 * // 带内侧高光的按钮 (更立体)
 * boxShadow: generateOuterShadow('md', {
 *   inner: { highlight: true }
 * });
 *
 * @example
 * // 完整立体效果 (内高光 + 内暗边)
 * boxShadow: generateOuterShadow('lg', {
 *   inner: {
 *     highlight: true,
 *     edge: true,
 *     intensity: 0.8
 *   }
 * });
 *
 * @example
 * // 紧凑布局,去除右侧阴影但保留立体感
 * boxShadow: generateOuterShadow('sm', {
 *   disableShadows: ['right'],
 *   inner: { highlight: true }
 * });
 */
export const generateOuterShadow = (
  size: ShadowSize,
  options: OuterShadowOptions = {}
): string => {
  const {
    baseSize = FALLBACK_BASE_SIZE,
    colorType = "default",
    disableShadows = [],
    inner = {},
  } = options;

  const { highlight = false, edge = false, intensity = 0.6 } = inner;

  const ratios = getShadowRatios(size);

  // 计算外阴影偏移和模糊
  const lightOffset = calc.multiply(baseSize, ratios.outer.lightOffset);
  const lightBlur = calc.multiply(baseSize, ratios.outer.lightBlur);
  const darkOffset = calc.multiply(baseSize, ratios.outer.darkOffset);
  const darkBlur = calc.multiply(baseSize, ratios.outer.darkBlur);

  // 获取颜色
  const lightColor = getShadowColor(colorType, "Light");
  const darkColor = getShadowColor(colorType, "Dark");

  const shadows: string[] = [];

  // === 内阴影层 (最先渲染,在最底层) ===

  // 左上内侧高光 (模拟光线照射边缘)
  if (highlight) {
    const innerLightOffset = calc.multiply(
      calc.multiply(baseSize, calc.multiply(ratios.outer.lightOffset, 0.5)),
      intensity
    );
    const innerLightBlur = calc.multiply(
      calc.multiply(baseSize, calc.multiply(ratios.outer.lightBlur, 0.4)),
      intensity
    );
    shadows.push(
      `inset ${innerLightOffset} ${innerLightOffset} ${innerLightBlur} ${lightColor}`
    );
  }

  // 右下内侧暗边 (模拟边缘厚度)
  if (edge) {
    const innerDarkOffset = calc.multiply(
      calc.multiply(baseSize, calc.multiply(ratios.outer.darkOffset, 0.4)),
      intensity * -1
    );
    const innerDarkBlur = calc.multiply(
      calc.multiply(baseSize, calc.multiply(ratios.outer.darkBlur, 0.3)),
      intensity
    );
    shadows.push(
      `inset ${innerDarkOffset} ${innerDarkOffset} ${innerDarkBlur} ${darkColor}`
    );
  }

  // === 外阴影层 ===

  // 浅色阴影 (左上高光)
  const noLeft = disableShadows.includes("left");
  const noTop = disableShadows.includes("top");

  if (!noLeft || !noTop) {
    const xOffset = noLeft ? "0" : calc.negate(lightOffset);
    const yOffset = noTop ? "0" : calc.negate(lightOffset);
    shadows.push(`${xOffset} ${yOffset} ${lightBlur} ${lightColor}`);
  }

  // 深色阴影 (右下投影)
  const noRight = disableShadows.includes("right");
  const noBottom = disableShadows.includes("bottom");

  if (!noRight || !noBottom) {
    const xOffset = noRight ? "0" : darkOffset;
    const yOffset = noBottom ? "0" : darkOffset;
    shadows.push(`${xOffset} ${yOffset} ${darkBlur} ${darkColor}`);
  }

  if (shadows.length === 0) {
    console.warn("[Shadow] All outer shadows disabled");
    return "none";
  }

  return shadows.join(", ");
};

interface InnerShadowOptions extends BaseShadowOptions {
  /**
   * 禁用特定方向的内阴影
   * - 'left': 禁用左侧深色阴影
   * - 'top': 禁用顶部深色阴影
   * - 'right': 禁用右侧浅色阴影
   * - 'bottom': 禁用底部浅色阴影
   */
  disableShadows?: Array<"left" | "top" | "right" | "bottom">;
  /**
   * 内阴影强度系数
   * @default 1
   */
  intensity?: number;
  /**
   * 是否添加增强深度的辅助阴影
   * @default false
   */
  enhanceDepth?: boolean;
}

/**
 * 生成轻拟物内阴影 (凹陷效果)
 *
 * 模拟按下状态,阴影方向与外阴影相反:
 * - 右下方: 浅色阴影 (边缘高光)
 * - 左上方: 深色阴影 (凹陷暗部)
 *
 * @example
 * // 标准凹陷效果
 * boxShadow: generateInnerShadow('md');
 *
 * @example
 * // 强凹陷效果
 * boxShadow: generateInnerShadow('lg', {
 *   intensity: 1.5,
 *   colorType: 'primary'
 * });
 *
 * @example
 * // 输入框凹陷,去除右侧和底部阴影
 * boxShadow: generateInnerShadow('sm', {
 *   disableShadows: ['right', 'bottom'],
 *   enhanceDepth: false
 * });
 */
export const generateInnerShadow = (
  size: ShadowSize,
  options: InnerShadowOptions = {}
): string => {
  const {
    baseSize = FALLBACK_BASE_SIZE,
    colorType = "default",
    disableShadows = [],
    intensity = 1,
    enhanceDepth = false,
  } = options;

  const ratios = getShadowRatios(size);

  // 计算偏移和模糊 (应用强度系数)
  const lightOffset = calc.multiply(
    baseSize,
    ratios.inner.lightOffset * intensity
  );
  const lightBlur = calc.multiply(baseSize, ratios.inner.lightBlur * intensity);

  const darkOffset = calc.multiply(
    baseSize,
    ratios.inner.darkOffset * intensity
  );
  const darkBlur = calc.multiply(baseSize, ratios.inner.darkBlur * intensity);

  // 获取颜色
  const lightColor = getShadowColor(colorType, "Light");
  const darkColor = getShadowColor(colorType, "Dark");

  const shadows: string[] = [];

  // 深色阴影 (左上凹陷暗部)
  const noLeft = disableShadows.includes("left");
  const noTop = disableShadows.includes("top");

  if (!noLeft || !noTop) {
    const xOffset = noLeft ? "0" : darkOffset;
    const yOffset = noTop ? "0" : darkOffset;
    shadows.push(`inset ${xOffset} ${yOffset} ${darkBlur} ${darkColor}`);
  }

  // 浅色阴影 (右下边缘高光)
  const noRight = disableShadows.includes("right");
  const noBottom = disableShadows.includes("bottom");

  if (!noRight || !noBottom) {
    const xOffset = noRight ? "0" : calc.negate(lightOffset);
    const yOffset = noBottom ? "0" : calc.negate(lightOffset);
    shadows.push(`inset ${xOffset} ${yOffset} ${lightBlur} ${lightColor}`);
  }

  // 可选: 增强深度的辅助阴影
  if (enhanceDepth && shadows.length > 0) {
    // 使用更细腻的辅助阴影来增强立体感
    const subtleOffset = calc.multiply(
      baseSize,
      ratios.inner.darkOffset * 0.4 * intensity
    );
    const subtleBlur = calc.multiply(
      baseSize,
      ratios.inner.darkBlur * 1.2 * intensity
    );
    shadows.unshift(
      `inset ${subtleOffset} ${subtleOffset} ${subtleBlur} ${darkColor}`
    );
  }

  if (shadows.length === 0) {
    console.warn("[Shadow] All inner shadows disabled");
    return "none";
  }

  return shadows.join(", ");
};

/**
 * 生成渐变背景
 * @param startColor 起始颜色
 * @param endColor 结束颜色
 * @param angle 渐变角度，默认 135deg
 * @returns CSS linear-gradient 字符串
 *
 * @example
 * background: generateGradient('#fff', '#eee')
 * background: generateGradient(themeContract.color.primary, themeContract.color.primaryLight, 90)
 */
export const generateGradient = (
  startColor: string,
  endColor: string,
  angle: number = 135
): string => {
  return `linear-gradient(${angle}deg, ${startColor} 0%, ${endColor} 100%)`;
};

/**
 * 生成滚动条渐变
 * @param action 操作类型
 * @param isVertical 是否垂直滚动条
 * @returns CSS linear-gradient 字符串
 *
 * @example
 * background: generateScrollbarGradient()
 * background: generateScrollbarGradient(true)
 */
export const generateScrollbarGradient = (
  action: "default" | "hover" | "active",
  isVertical: boolean = true
): string => {
  const start =
    action === "default"
      ? themeContract.color.scrollbarThumbStart
      : action === "hover"
      ? themeContract.color.scrollbarThumbHoverStart
      : themeContract.color.scrollbarThumbActiveStart;

  const end =
    action === "default"
      ? themeContract.color.scrollbarThumbEnd
      : action === "hover"
      ? themeContract.color.scrollbarThumbHoverEnd
      : themeContract.color.scrollbarThumbActiveEnd;

  return generateGradient(start, end, isVertical ? 90 : 180);
};

/**
 * 生成焦点环样式
 * @param color 焦点环颜色
 * @param offset 偏移距离
 * @returns CSS box-shadow 字符串
 *
 * @example
 * boxShadow: generateFocusRing()
 * boxShadow: generateFocusRing(themeContract.color.error, '3px')
 */
export const generateFocusRing = (
  color: string = themeContract.color.primary,
  offset: string = "2px"
): string => {
  return `0 0 0 ${offset} ${color}`;
};

/**
 * 多行文本截断
 * @param lines 显示的行数
 */
export const textClamp = (lines: number = 2) =>
  style({
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  });

export const generateTextShadow = (offset: string = "1px"): string => {
  return `${themeContract.color.shadowLight1} ${calc.negate(
    offset
  )} ${calc.negate(offset)} ${calc.multiply(offset, 2)}, ${
    themeContract.color.shadowDark1
  } ${offset} ${offset} ${calc.multiply(offset, 2)}`;
};

export const generateTextShadowActive = (offset: string = "1px"): string => {
  return `${themeContract.color.shadowLight1} ${calc.negate(
    offset
  )} ${calc.negate(offset)} ${offset}, ${
    themeContract.color.shadowDark1
  } ${offset} ${offset} ${calc.multiply(offset, 3)}`;
};
