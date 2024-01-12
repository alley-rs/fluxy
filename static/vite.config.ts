import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/upload": "http://127.0.0.1:5800",
      "/ping": "http://127.0.0.1:5800",
    },
  },

  build: {
    outDir: "../src-tauri/static",
  },

  plugins: [react()],
});
