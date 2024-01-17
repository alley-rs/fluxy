import { useState } from "react";
import { Button, Space } from "antd";
import { suspense } from "~/advance/index";
import { LazyHomeButton, LazyReceive, LazySend } from "~/lazy";
import "~/App.scss";

enum Mode {
  Send,
  Receive,
}

const App = () => {
  const [mode, setMode] = useState<Mode | null>(null);

  const backToHome = () => setMode(null);

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
  else
    return (
      <>
        {mode === Mode.Send
          ? suspense(<LazySend />)
          : suspense(<LazyReceive />)}

        {suspense(<LazyHomeButton onClick={backToHome} />)}
      </>
    );
};

export default App;
