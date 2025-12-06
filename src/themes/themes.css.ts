import {
  assignVars,
  createGlobalTheme,
  createThemeContract,
} from "@vanilla-extract/css";

/**
 * ============================================
 * 设计令牌 (Design Tokens)
 * 全局常量，在所有主题中保持一致
 * ============================================
 */
export const tokens = createGlobalTheme(":root", {
  /** 边框宽度 */
  borderWidth: {
    none: "0",
    sm: "1px",
    md: "2px",
    lg: "4px",
  },

  /** 间距系统 (基于 4px 基准) */
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    xxxl: "64px",
  },

  /** 圆角半径 */
  radius: {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    xxl: "24px",
    full: "9999px",
  },

  /** 字体大小 */
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    xxl: "24px",
    xxxl: "32px",
    xxxxl: "48px",
  },

  /** 字重 */
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  /** 字体族 */
  fontFamily: {
    system:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  /** 行高 */
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  /** 字间距 */
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },

  /** 透明度等级 */
  opacity: {
    transparent: "0",
    low: "0.1",
    medium: "0.5",
    high: "0.8",
    higher: "0.9",
    full: "1",
  },

  /** 模糊度 (用于毛玻璃效果) */
  blur: {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    xxl: "24px",
  },

  /** 缩放比例 */
  scale: {
    90: "0.9",
    95: "0.95",
    100: "1",
    105: "1.05",
    110: "1.1",
    125: "1.25",
    150: "1.5",
  },

  /** 动画时长 */
  duration: {
    // 极快 / 无感级别（用于微交互或性能敏感场景）
    instant: "0ms",
    ultraFast: "50ms",
    faster: "100ms",

    // 常用交互动画
    fast: "150ms",
    normal: "200ms",
    moderate: "250ms", // 介于 normal 和 slow 之间，适合轻柔过渡
    smooth: "300ms", // 常见于卡片展开、抽屉滑入等
    slow: "400ms",

    // 较慢动画（用于强调、引导注意）
    slower: "500ms",
    deliberate: "600ms", // 有意为之的慢速，用于重要状态变化
    graceful: "750ms", // 优雅缓入缓出，适合模态框或 hero 动画

    // 极慢 / 戏剧性效果（慎用）
    ultraSlow: "1s",
    cinematic: "1.5s", // 用于欢迎页、引导页等特殊场景
    dramatic: "2s", // 极少见，仅用于特殊 UI 叙事
  },

  /** 动画缓动函数 */
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },

  /** Z-index 层级管理 */
  zIndex: {
    hide: "-1",
    base: "0",
    dropdown: "1000",
    sticky: "1100",
    fixed: "1200",
    modalBackdrop: "1300",
    modal: "1400",
    popover: "1500",
    tooltip: "1600",
    notification: "1700",
    max: "9999",
  },

  /** 响应式断点 */
  breakpoint: {
    mobileSmall: "320px",
    mobileLarge: "640px",
    tabletPortrait: "768px",
    tabletLandscape: "1024px",
    desktop: "1280px",
    desktopLarge: "1536px",
    desktopXLarge: "1920px",
  },
});

/**
 * ============================================
 * 主题契约 (Theme Contract)
 * 定义所有主题必须实现的颜色变量
 * ============================================
 */
export const themeContract = createThemeContract({
  color: {
    // 基础颜色
    background: null,
    surface: null,
    foreground: null,

    // 主色系
    primary: null,
    primaryLight: null,
    primaryDark: null,
    primaryShadowLight: null,
    primaryShadowDark: null,

    // 次要色系
    secondary: null,
    secondaryLight: null,
    secondaryDark: null,
    secondaryShadowLight: null,
    secondaryShadowDark: null,

    // 成功色系
    success: null,
    successLight: null,
    successDark: null,
    successShadowLight: null,
    successShadowDark: null,

    // 警告色系
    warning: null,
    warningLight: null,
    warningDark: null,
    warningShadowLight: null,
    warningShadowDark: null,

    // 错误色系
    error: null,
    errorLight: null,
    errorDark: null,
    errorShadowLight: null,
    errorShadowDark: null,

    // 信息色系
    info: null,
    infoLight: null,
    infoDark: null,
    infoShadowLight: null,
    infoShadowDark: null,

    // 中性色系，默认使用在一些组件中
    neutral: null,
    neutralLight: null,
    neutralDark: null,
    neutralShadowLight: null,
    neutralShadowDark: null,
    neutralBackground: null,
    neutralForeground: null,
    neutralBackgroundInverted: null,
    neutralForegroundInverted: null,
    neutralForegroundStaticInverted: null,
    neutralBorder1: null,
    neutralBorder2: null,
    neutralBorder3: null,

    // 通用阴影
    shadowLight1: null,
    shadowLight2: null,
    shadowLight3: null,

    shadowDark1: null,
    shadowDark2: null,
    shadowDark3: null,

    // 滚动条
    scrollbarThumbStart: null,
    scrollbarThumbEnd: null,
    scrollbarThumbHoverStart: null,
    scrollbarThumbHoverEnd: null,
    scrollbarThumbActiveStart: null,
    scrollbarThumbActiveEnd: null,

    // 遮罩层
    overlay: null,
  },
});

/**
 * ============================================
 * 浅色主题 (Light Theme)
 * ============================================
 */
export const lightThemeVars = {
  color: {
    // 基础颜色
    background: "hsl(210, 20%, 92%)", // #e8ecf0
    surface: "hsl(210, 20%, 92%)",
    foreground: "hsl(215, 20%, 25%)", // #2d3748

    // 主色系 - 蓝色
    primary: "hsl(207, 73%, 57%)", // #4299e1
    primaryLight: "hsl(206, 78%, 65%)", // #63b3ed
    primaryDark: "hsl(208, 60%, 49%)", // #3182ce
    primaryShadowLight: "hsla(207, 22%, 81%, 0.50)",
    primaryShadowDark: "hsla(207, 88%, 33%, 0.70)",

    // 次要色系 - 灰色
    secondary: "hsl(215, 16%, 47%)", // #718096
    secondaryLight: "hsl(214, 15%, 63%)", // #a0aec0
    secondaryDark: "hsl(215, 19%, 35%)", // #4a5568
    secondaryShadowLight: "hsla(215, 5%, 76%, 0.50)",
    secondaryShadowDark: "hsla(215, 19%, 23%, 0.70)",

    // 成功色系 - 绿色
    success: "hsl(142, 51%, 52%)", // #48bb78
    successLight: "hsl(142, 57%, 63%)", // #68d391
    successDark: "hsl(142, 47%, 45%)", // #38a169
    successShadowLight: "hsla(142, 15%, 77%, 0.50)",
    successShadowDark: "hsla(142, 61%, 28%, 0.70)",

    // 警告色系 - 橙色
    warning: "hsl(25, 81%, 57%)", // #ed8936
    warningLight: "hsl(25, 88%, 66%)", // #f6ad55
    warningDark: "hsl(25, 75%, 49%)", // #dd6b20
    warningShadowLight: "hsla(25, 24%, 81%, 0.50)",
    warningShadowDark: "hsla(25, 97%, 33%, 0.70)",

    // 错误色系 - 红色
    error: "hsl(0, 87%, 67%)", // #f56565
    errorLight: "hsl(0, 95%, 75%)", // #fc8181
    errorDark: "hsl(0, 74%, 58%)", // #e53e3e
    errorShadowLight: "hsla(0, 26%, 91%, 0.50)",
    errorShadowDark: "hsla(0, 100%, 37%, 0.70)",

    // 信息色系 - 青色
    info: "hsl(176, 61%, 56%)", // #4fd1c5
    infoLight: "hsl(177, 67%, 70%)", // #81e6d9
    infoDark: "hsl(176, 50%, 47%)", // #38b2ac
    infoShadowLight: "hsla(176, 18%, 80%, 0.50)",
    infoShadowDark: "hsla(176, 73%, 32%, 0.70)",

    // 中性色系
    neutral: "hsl(214, 18%, 82%)", // #cbd5e0
    neutralLight: "hsl(214, 32%, 91%)", // #e2e8f0
    neutralDark: "hsl(214, 15%, 63%)", // #a0aec0
    neutralShadowLight: "hsla(214, 5%, 99%, 0.50)",
    neutralShadowDark: "hsla(214, 22%, 40%, 0.70)",
    neutralBackground: "hsl(0, 0%, 95%)",
    neutralForeground: "hsl(0, 0%, 5%)",
    neutralBackgroundInverted: "hsl(0, 0%, 5%)",
    neutralForegroundInverted: "hsl(0, 0%, 95%)",
    neutralForegroundStaticInverted: "hsl(0, 0%, 95%)",
    neutralBorder1: "hsl(0, 0%, 81.96%)",
    neutralBorder2: "hsl(0, 0%, 87.84%)",
    neutralBorder3: "hsl(0, 0%, 94.12%)",

    // 通用阴影
    shadowLight1: "hsla(0, 0%, 100%, 0.9)",
    shadowLight2: "hsla(0, 0%, 100%, 0.8)",
    shadowLight3: "hsla(0, 0%, 100%, 0.7)",

    shadowDark1: "hsla(213, 19%, 71%, 0.6)", // #a3b1c6
    shadowDark2: "hsla(213, 19%, 71%, 0.5)", // #a3b1c6
    shadowDark3: "hsla(213, 19%, 71%, 0.4)", // #a3b1c6

    // 滚动条
    scrollbarThumbStart: "hsl(210, 36%, 96%)",
    scrollbarThumbEnd: "hsl(217, 30%, 86%)",
    scrollbarThumbHoverStart: "hsl(214, 47%, 97%)",
    scrollbarThumbHoverEnd: "hsl(217, 30%, 76%)",
    scrollbarThumbActiveStart: "hsl(217, 30%, 86%)",
    scrollbarThumbActiveEnd: "hsl(210, 36%, 96%)",

    // 遮罩层
    overlay: "hsla(0, 0%, 100%, 0.7)",
  },
};

/**
 * ============================================
 * 深色主题 (Dark Theme)
 * ============================================
 */
export const darkThemeVars = {
  color: {
    // 基础颜色
    background: "hsl(220, 15%, 12%)", // #1a1d23
    surface: "hsl(220, 18%, 13%)", // #1a202c
    foreground: "hsl(220, 10%, 90%)", // #e4e6eb

    // 主色系 - 蓝色
    primary: "hsl(207, 68%, 42%)",
    primaryDark: "hsl(207, 68%, 52%)",
    primaryLight: "hsl(207, 68%, 22%)",
    primaryShadowLight: "hsla(207, 10%, 50%, 0.30)",
    primaryShadowDark: "hsla(207, 34%, 0%, 0.95)",

    // 次要色系 - 灰色
    secondary: "hsl(215, 12%, 55%)",
    secondaryLight: "hsl(215, 12%, 63%)",
    secondaryDark: "hsl(215, 12%, 35%)",
    secondaryShadowLight: "hsla(215, 0%, 30%, 0.10)",
    secondaryShadowDark: "hsla(215, 6%, 10%, 0.95)",

    // 成功色系 - 绿色
    success: "hsl(142, 45%, 32%)",
    successLight: "hsl(142, 45%, 48%)",
    successDark: "hsl(142, 45%, 22%)",
    successShadowLight: "hsla(142, 7%, 44%, 0.30)",
    successShadowDark: "hsla(142, 23%, 0%, 0.95)",

    // 警告色系 - 橙色
    warning: "hsl(25, 75%, 40%)",
    warningLight: "hsl(25, 75%, 47%)",
    warningDark: "hsl(25, 75%, 30%)",
    warningShadowLight: "hsla(25, 11%, 50%, 0.30)",
    warningShadowDark: "hsla(25, 38%, 0%, 0.95)",

    // 错误色系 - 红色
    error: "hsl(355, 60%, 38%)",
    errorLight: "hsl(355, 60%, 48%)",
    errorDark: "hsl(355, 60%, 28%)",
    errorShadowLight: "hsla(355, 9%, 50%, 0.30)",
    errorShadowDark: "hsla(355, 30%, 0%, 0.95)",

    // 信息色系 - 青色
    info: "hsl(176, 55%, 32%)",
    infoLight: "hsl(176, 55%, 42%)",
    infoDark: "hsl(176, 55%, 22%)",
    infoShadowLight: "hsla(176, 8%, 44%, 0.30)",
    infoShadowDark: "hsla(176, 28%, 0%, 0.95)",

    // 中性色系
    neutral: "hsl(214, 10%, 40%)",
    neutralLight: "hsl(215, 16%, 47%)", // #718096
    neutralDark: "hsl(215, 20%, 25%)", // #2d3748
    neutralShadowLight: "hsla(214, 2%, 50%, 0.30)",
    neutralShadowDark: "hsla(214, 5%, 0%, 0.95)",
    neutralBackground: "hsl(0, 0%, 5%)",
    neutralForeground: "hsl(0, 0%, 95%)",
    neutralBackgroundInverted: "hsl(0, 0%, 95%)",
    neutralForegroundInverted: "hsl(0, 0%, 5%)",
    neutralForegroundStaticInverted: "hsl(0, 0%, 95%)",
    neutralBorder1: "#666666",
    neutralBorder2: "#525252",
    neutralBorder3: "#3d3d3d",

    // 通用阴影
    shadowLight1: "hsla(0, 0%, 100%, 0.08)",
    shadowLight2: "hsla(0, 0%, 100%, 0.08)",
    shadowLight3: "hsla(0, 0%, 100%, 0.08)",

    shadowDark1: "hsla(0, 0%, 0%, 0.6)",
    shadowDark2: "hsla(0, 0%, 0%, 0.5)",
    shadowDark3: "hsla(0, 0%, 0%, 0.4)",

    // 滚动条
    scrollbarThumbStart: "hsl(219, 19%, 18%)",
    scrollbarThumbEnd: "hsl(222, 24%, 11%)",
    scrollbarThumbHoverStart: "hsl(219, 17%, 25%)",
    scrollbarThumbHoverEnd: "hsl(222, 21%, 12%)",
    scrollbarThumbActiveStart: "hsl(222, 24%, 11%)",
    scrollbarThumbActiveEnd: "hsl(219, 19%, 18%)",

    // 遮罩层
    overlay: "hsla(0, 0%, 0%, 0.7)",
  },
};

/**
 * ============================================
 * 导出主题
 * ============================================
 */
export const lightTheme = assignVars(themeContract, lightThemeVars);
export const darkTheme = assignVars(themeContract, darkThemeVars);

/**
 * ============================================
 * 响应式媒体查询
 * 注意：这些是组合后的媒体查询字符串，基于 tokens.breakpoint
 * ============================================
 */
export const mediaQuery = {
  // 最小宽度查询 (移动优先)
  mobileSmall: `screen and (min-width: ${tokens.breakpoint.mobileSmall})`,
  mobileLarge: `screen and (min-width: ${tokens.breakpoint.mobileLarge})`,
  tabletPortrait: `screen and (min-width: ${tokens.breakpoint.tabletPortrait})`,
  tabletLandscape: `screen and (min-width: ${tokens.breakpoint.tabletLandscape})`,
  desktop: `screen and (min-width: ${tokens.breakpoint.desktop})`,
  desktopLarge: `screen and (min-width: ${tokens.breakpoint.desktopLarge})`,
  desktopXLarge: `screen and (min-width: ${tokens.breakpoint.desktopXLarge})`,

  // 最大宽度查询
  mobileSmallMax: `screen and (max-width: ${tokens.breakpoint.mobileLarge})`,
  mobileLargeMax: `screen and (max-width: ${tokens.breakpoint.tabletPortrait})`,
  tabletPortraitMax: `screen and (max-width: ${tokens.breakpoint.tabletLandscape})`,
  tabletLandscapeMax: `screen and (max-width: ${tokens.breakpoint.desktop})`,
  desktopMax: `screen and (max-width: ${tokens.breakpoint.desktopLarge})`,
} as const;

/**
 * ============================================
 * 预定义过渡效果
 * 注意：这些是组合后的 transition 字符串，基于 tokens 中的 duration 和 easing
 * ============================================
 */
export const transitions = {
  base: `all ${tokens.duration.normal} ${tokens.easing.easeInOut}`,
  fast: `all ${tokens.duration.fast} ${tokens.easing.easeOut}`,
  slow: `all ${tokens.duration.slow} ${tokens.easing.smooth}`,
  spring: `all ${tokens.duration.normal} ${tokens.easing.spring}`,
  colors: `background-color ${tokens.duration.normal} ${tokens.easing.easeInOut}, color ${tokens.duration.normal} ${tokens.easing.easeInOut}, border-color ${tokens.duration.normal} ${tokens.easing.easeInOut}`,
  transform: `transform ${tokens.duration.normal} ${tokens.easing.spring}`,
  opacity: `opacity ${tokens.duration.fast} ${tokens.easing.easeOut}`,
  shadow: `box-shadow ${tokens.duration.normal} ${tokens.easing.easeInOut}`,
} as const;
