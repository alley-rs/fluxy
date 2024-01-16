import ReactDOM from "react-dom/client";
import "antd-mobile/es/global";
import App from "./App.tsx";
import "./index.scss";

if (matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.setAttribute("data-prefers-color-scheme", "dark");
} else {
  document.documentElement.setAttribute("data-prefers-color-scheme", "light");
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
