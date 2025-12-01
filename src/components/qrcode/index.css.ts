import { style } from "@vanilla-extract/css";

export const wrapper = style({
  flex: 1,
  padding: "64px 36px",
  display: "flex",
  justifyContent: "center",
});

export const contentWrapper = style({
  flex: 1,
  display: "flex",
  justifyContent: "space-evenly",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
  padding: "24px",
});

export const svg = style({
  margin: "10px 0",
});

export const link = style({
  marginTop: "5px",
  wordBreak: "break-all",
  cursor: "pointer",

  ":hover": {
    textDecoration: "underline",
  },
});

export const footer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
});
