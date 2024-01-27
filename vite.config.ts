import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";

const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  // build: {
  //   outDir: "./src-tauri/static",
  // },

  resolve: {
    alias: {
      "~/": `${pathSrc}/`,
    },
    conditions: ["development", "browser"],
  },

  plugins: [solid()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
