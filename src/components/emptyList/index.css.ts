import {
  style,
  createThemeContract,
  assignVars,
  globalStyle,
} from "@vanilla-extract/css";
import { themeContract, tokens } from "~/themes/themes.css";

// 空列表组件颜色主题合约
export const emptyListThemeContract = createThemeContract({
  color: {
    // 背景
    bgFrom: null,
    bgVia: null,
    bgTo: null,

    // 剪贴板
    clipboardFrom: null,
    clipboardTo: null,

    // 夹子
    clipFrom: null,
    clipTo: null,
    clipInnerFrom: null,
    clipInnerTo: null,

    // 盒子
    boxFrom: null,
    boxTo: null,
    boxTopFrom: null,
    boxTopTo: null,
    boxSideFrom: null,
    boxSideTo: null,

    // 纸张
    paper: null,

    // 列表项
    listItem: null,
    listItemLight: null,

    // 装饰
    decoration: null,

    // 阴影
    shadow: null,

    // 文字
    titleText: null,
    descText: null,
  },
});

// 亮色主题颜色变量
const lightThemeColors = {
  color: {
    // 背景
    bgFrom: "#f8fafc",
    bgVia: "#f1f5f9",
    bgTo: "#e2e8f0",

    // 剪贴板
    clipboardFrom: "#e2e8f0",
    clipboardTo: "#cbd5e1",

    // 夹子
    clipFrom: "#94a3b8",
    clipTo: "#64748b",
    clipInnerFrom: "#475569",
    clipInnerTo: "#334155",

    // 盒子
    boxFrom: "#cbd5e1",
    boxTo: "#94a3b8",
    boxTopFrom: "#e2e8f0",
    boxTopTo: "#cbd5e1",
    boxSideFrom: "#94a3b8",
    boxSideTo: "#64748b",

    // 纸张
    paper: "#ffffff",

    // 列表项
    listItem: "#94a3b8",
    listItemLight: "#cbd5e1",

    // 装饰
    decoration: "#94a3b8",

    // 阴影
    shadow: "#64748b",

    // 文字
    titleText: "#475569",
    descText: "#94a3b8",
  },
};

// 暗色主题颜色变量
const darkThemeColors = {
  color: {
    // 背景
    bgFrom: "#0f172a",
    bgVia: "#1e293b",
    bgTo: "#334155",

    // 剪贴板
    clipboardFrom: "#334155",
    clipboardTo: "#475569",

    // 夹子
    clipFrom: "#475569",
    clipTo: "#64748b",
    clipInnerFrom: "#64748b",
    clipInnerTo: "#94a3b8",

    // 盒子
    boxFrom: "#475569",
    boxTo: "#64748b",
    boxTopFrom: "#475569",
    boxTopTo: "#64748b",
    boxSideFrom: "#334155",
    boxSideTo: "#475569",

    // 纸张
    paper: "#1e293b",

    // 列表项
    listItem: "#475569",
    listItemLight: "#64748b",

    // 装饰
    decoration: "#475569",

    // 阴影
    shadow: "#000000",

    // 文字
    titleText: "#cbd5e1",
    descText: "#64748b",
  },
};

// 应用主题变量
export const lightEmptyListTheme = assignVars(
  emptyListThemeContract,
  lightThemeColors
);
export const darkEmptyListTheme = assignVars(
  emptyListThemeContract,
  darkThemeColors
);

globalStyle('[data-theme="dark"]', {
  vars: darkEmptyListTheme,
});

globalStyle('[data-theme="light"]', {
  vars: lightEmptyListTheme,
});

export const wrapper = style({
  position: "relative",
});

export const textWrapper = style({
  textAlign: "center",
  marginTop: "1.5rem",
});

export const title = style({
  fontWeight: tokens.fontWeight.semibold,
  fontSize: "1.5rem",
  lineHeight: "2rem",
  marginBottom: ".5rem",
  color: themeContract.color.foreground,
});

export const description = style({
  color: themeContract.color.secondary,
  fontSize: tokens.fontSize.sm,
});
