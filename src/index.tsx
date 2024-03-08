/* @refresh reload */
import { render } from "solid-js/web";
import "alley-components/lib/index.css";
import "./index.scss";
import App from "./App";

const root = document.getElementById("root");

render(() => <App />, root!);
