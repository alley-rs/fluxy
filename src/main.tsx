import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import ReactDOM from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import App from "./App";
import "./styles.scss";

appWindow.theme().then((v) => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <ConfigProvider
        locale={zhCN}
        theme={{
          cssVar: true,
          algorithm:
            v === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <App />
      </ConfigProvider>
    </React.StrictMode>,
  );
});
