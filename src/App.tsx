import { Button, Space } from "antd";
import "./App.scss";
import { useState } from "react";
import Receive from "./pages/receive";
import Send from "./pages/send";

enum Mode {
  Send,
  Receive,
}

const App = () => {
  const [mode, setMode] = useState<Mode | null>(null);

  console.log(mode);

  if (mode === null)
    return (
      <div className="container index">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <span>选择文件传输方式</span>
          <Button block size="large" onClick={() => setMode(Mode.Receive)}>
            接收
          </Button>
          <Button block size="large" onClick={() => setMode(Mode.Send)}>
            发送
          </Button>
        </Space>
      </div>
    );
  else if (mode === Mode.Receive) return <Receive />;
  else return <Send />;
};

export default App;
