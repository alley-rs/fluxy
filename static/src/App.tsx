import { Upload, Button } from "antd";
import type { UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import upload from "./request";
import "./App.css";

function App() {
  const props: UploadProps = {
    action: "/upload",
    customRequest: upload,
    multiple: true,
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
}

export default App;
