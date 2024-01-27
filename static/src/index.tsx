/* @refresh reload */
import { render } from "solid-js/web";

import "./index.scss";
import App from "./App";

if (matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.setAttribute("data-prefers-color-scheme", "dark");
} else {
  document.documentElement.setAttribute("data-prefers-color-scheme", "light");
}

const root = document.getElementById("root");

render(() => <App />, root!);
