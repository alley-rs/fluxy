import { style } from "@vanilla-extract/css";

export const app = style({
  flex: 1,
  display: "flex",
  height: `calc(100vh - ${
    import.meta.env.TAURI_ENV_PLATFORM === "darwin" ? 26 : 36
  }px)`,
});
