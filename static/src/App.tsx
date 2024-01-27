import Result from "~/components/result";
import Send from "./pages/send";
import Receive from "./pages/receive";
import "./App.scss";
import { Match, Switch } from "solid-js";

type Mode = "receive" | "send";

const App = () => {
  const href = window.location.href;
  const url = new URL(href);
  const params = new URLSearchParams(url.search);
  const mode = params.get("mode") as Mode | null;

  return (
    <Switch>
      <Match when={!mode}>
        <div class="container result">
          <Result
            status="error"
            title="无效的请求"
            description="缺少查询参数: mode"
          />
        </div>
      </Match>

      <Match when={mode === "send"}>
        <Send />
      </Match>

      <Match when={mode === "receive"}>
        <Receive />
      </Match>
    </Switch>
  );
};

export default App;
