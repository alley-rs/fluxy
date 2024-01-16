import { Result } from "antd-mobile";
import "./App.scss";
import Send from "./pages/send";
import Receive from "./pages/receive/index.tsx";

type Mode = "receive" | "send";

const App = () => {
  const href = window.location.href;
  const url = new URL(href);
  const params = new URLSearchParams(url.search);
  const mode = params.get("mode") as Mode | null;

  if (!mode) {
    return (
      <div className="container result">
        <Result
          status="error"
          title="无效的请求"
          description="缺少查询参数: mode"
        />
      </div>
    );
  }

  if (mode === "send") {
    return <Send />;
  } else {
    return <Receive />;
  }
};

export default App;
