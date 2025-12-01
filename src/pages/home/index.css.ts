import { style } from "@vanilla-extract/css";

export const home = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-around",

  "@media": {
    "(orientation: landscape)": {
      justifyContent: "space-evenly",
    },
  },
});

// 使用 clamp 实现响应式尺寸：最小 3rem，理想 6vw，最大 6rem
const titleSize = "clamp(3rem, 6vw, 6rem)";

export const title = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  fontSize: titleSize,
});

export const buttons = style({
  flex: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-around",

  "@media": {
    "(orientation: landscape)": {
      flex: 2,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-evenly",
    },
  },
});

// 使用 clamp 实现响应式尺寸：最小 3rem，理想 8vw（或 8vh），最大 6rem
const buttonSize = "clamp(12rem, 16vw, 24rem)";

export const button = style({
  display: "flex !important",
  flexDirection: "column",
  alignItems: "center",

  flexShrink: 0,
  width: buttonSize,
  height: buttonSize,
});

export const buttonIcon = style({
  color: "#fff",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  width: "4rem",
  height: "4rem",
  display: "flex",
  marginBottom: "1rem",
});

export const sendIcon = style({
  backgroundImage: "linear-gradient(to right, #60a5fa , #6366f1)",
});

export const receiveIcon = style({
  backgroundImage: "linear-gradient(to right, #4ade80 , #10b981)",
});
