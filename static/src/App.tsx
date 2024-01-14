import { useEffect, useState } from "react";
import { Upload, Button } from "antd";
import type { UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import upload from "./request";
import "./App.css";
import asyncPool from "./asyncPool";

const App = () => {
  const [fileCount, setFileCount] = useState(0);
  const [requestTasks, setRequestTasks] = useState<RequestTask[]>([]);

  const appendTask = (task: RequestTask) =>
    setRequestTasks((pre) => [...pre, task]);

  const props: UploadProps = {
    action: "/upload",
    onChange: ({ fileList }) => {
      setFileCount(fileList.length);
    },
    customRequest: (option) => upload(option, appendTask),
    multiple: true,
    // concurrencyLimit: 2, // antd 5.12.8 版本此属性无意义
  };

  useEffect(() => {
    if (fileCount === requestTasks.length) {
      asyncPool(
        2, // 并发数量，应该根据实际场景判断，比如通过 fileList 中的文件尺寸进行判断，当超过某个阈值时减小并发量
        requestTasks,
        (item) =>
          new Promise<void>((resolve) => {
            const xhr = item.xhr;

            item.done = resolve;

            xhr.send(item.data);
          }),
      );
    }
  }, [fileCount, requestTasks]);

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>选择文件</Button>
    </Upload>
  );
};

export default App;
