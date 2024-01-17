import { useEffect, useState } from "react";
import { Result, SpinLoading, List, Space, Toast } from "antd-mobile";
import { DownlandOutline } from "antd-mobile-icons";
import "./index.scss";
import fileType from "./fileType";

const Receive = () => {
  const [files, setFiles] = useState<SendFile[] | null>(null);
  const [error, setError] = useState<BadRequest | null>(null);

  useEffect(() => {
    if (files) return;

    const fetchData = async () => {
      const response = await fetch("/files");

      if (response.status !== 200) {
        const msg = await response.json();
        setError(msg);
      }

      const body: SendFile[] = await response.json();
      setFiles(body);
      Toast.show({ content: "不要刷新此页面，否则文件列表将会被清空" });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="container result">
        <Result status="error" title={error.error} description={error.advice} />
      </div>
    );
  }

  if (!files) {
    return <SpinLoading />;
  }

  return (
    <div className="container">
      <List
        className="receive-file-list"
        header="点击文件名或右侧下载按钮即可下载文件"
      >
        {files.map((f) => {
          const url = "/download/" + encodeURIComponent(f.path);
          return (
            <List.Item
              key={f.path}
              description={
                <Space style={{ "--gap": "24px" }}>
                  <span>大小：{f.size}</span>
                  <span>类型：{fileType(f.extension)}</span>
                </Space>
              }
              extra={
                <a download={f.name} href={url}>
                  <DownlandOutline fontSize={20} />
                </a>
              }
            >
              <a download={f.name} href={url} className="download-url">
                {f.name}
              </a>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
};

export default Receive;
