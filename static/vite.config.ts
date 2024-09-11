import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "node:path";

const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/upload": "http://127.0.0.1:5800",
      "/ping": "http://127.0.0.1:5800",
      "/files": "http://127.0.0.1:5800",
      "/download": "http://127.0.0.1:5800",
    },
  },

  resolve: {
    alias: {
      "~/": `${pathSrc}/`,
    },
  },

  build: {
    outDir: "../src-tauri/static",
  },

  plugins: [solid()],
});
