/* @refresh reload */
import { render } from "solid-js/web";
import "alley-components/lib/index.css";
import "./index.scss";
import App from "./App";

const root = document.getElementById("root");

if (import.meta.env.MODE === "production") {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
render(() => <App />, root!);
