import { useEffect, useState } from "react";
import { Button, Progress } from "antd";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { OrderedSet } from "~/utils";
import "./App.css";
import { getDownloadDir } from "./api";
import { open } from "@tauri-apps/api/shell";

interface FileListItemProps {
  name: string;
  percent: number;
}

const FileListItem = ({ name, percent }: FileListItemProps) => (
  <div>
    <div
      style={{
        textAlign: "left",
        fontSize: "0.8rem",
        color: percent < 100 ? "#959595" : "#000",
      }}
    >
      {name}
    </div>
    <Progress percent={percent} />
  </div>
);

const App = () => {
  const [downloadDir, setDownloadDir] = useState<string | null>(null);

  const [qrcode, setQrcode] = useState<QrCode | null>(null);

  const [progressList, setProgressList] = useState<OrderedSet<TaskMessage>>(
    new OrderedSet("name"),
  );
  const [fileList, setFileList] = useState<TaskMessage[]>([]);

  useEffect(() => {
    if (downloadDir) return;

    getDownloadDir().then((d) => setDownloadDir(d));
  }, []);

  useEffect(() => {
    const unlisten = appWindow.listen<TaskMessage>("upload://progress", (e) => {
      if (qrcode) setQrcode(null);

      setProgressList((pre) => pre.push(e.payload));

      if (e.payload.progress === 100) {
        setProgressList((pre) => pre.remove(e.payload));

        setFileList((pre) => {
          const t = pre.find((v) => v.name === e.payload.name);

          return t ? pre : [...pre, e.payload];
        });
      }
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, [qrcode]);

  useEffect(() => {
    if (qrcode || !progressList.empty() || fileList.length) return;

    invoke<QrCode>("local_ip_qr_code").then((s) => setQrcode(s));
  }, []);

  useEffect(() => {
    if (!qrcode) return;

    const query = async () => {
      const timer = setInterval(async () => {
        const used = await invoke<boolean>("get_qr_code_state", {
          id: qrcode.id,
        });

        if (used) {
          clearTimeout(timer);
          setQrcode(null);
        }
      }, 500);
    };

    query();
  }, [qrcode]);

  return (
    <>
      {downloadDir && !qrcode ? (
        <div className="container button">
          <Button type="default" onClick={async () => open(downloadDir)}>
            打开文件夹
          </Button>
        </div>
      ) : null}

      <div className="container">
        {fileList.map((t) => (
          <FileListItem key={t.name} name={t.name} percent={100} />
        ))}

        {progressList.map((progress) => (
          <FileListItem
            key={progress.name}
            name={progress.name}
            percent={Math.round(progress.progress)}
          />
        ))}

        {qrcode ? (
          <>
            <h2>扫码连接</h2>
            <div dangerouslySetInnerHTML={{ __html: qrcode.svg }} />

            <div>或在浏览器中访问</div>
            <div>{qrcode.url}</div>
          </>
        ) : fileList.length ? null : (
          <div>请在手机端上传文件</div>
        )}
      </div>
    </>
  );
};

export default App;
