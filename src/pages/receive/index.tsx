import { useEffect, useState } from "react";
import { Empty, Flex } from "antd";
import { appWindow } from "@tauri-apps/api/window";
import { OrderedSet } from "~/utils";
import { getUploadQrCode, getQrCodeState } from "~/api";
import FileListItem from "./fileListItem";
import "./index.scss";
import { suspense } from "~/advance";
import { LazyReceiveHeader, LazyReceiveQrCode, LazyFloatButtons } from "~/lazy";

interface ReceiveProps {
  toHome: () => void;
}

const Receive = ({ toHome }: ReceiveProps) => {
  const [qrcode, setQrcode] = useState<QrCode | null>(null);

  const [progressList, setProgressList] = useState<OrderedSet<TaskMessage>>(
    new OrderedSet("name"),
  );
  const [fileList, setFileList] = useState<Omit<TaskMessage, "speed">[]>([]);

  useEffect(() => {
    const unlisten = appWindow.listen<TaskMessage>("upload://progress", (e) => {
      if (qrcode) setQrcode(null);

      setProgressList((pre) => pre.push(e.payload));

      const { name, percent, size } = e.payload;

      if (percent === 100) {
        setProgressList((pre) => pre.remove(e.payload));

        setFileList((pre) => {
          const t = pre.find((v) => v.name === name);

          return t ? pre : [...pre, { name, percent, size }];
        });
      }
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, [qrcode]);

  useEffect(() => {
    if (qrcode || !progressList.empty() || fileList.length) return;

    getUploadQrCode().then((c) => setQrcode(c));
  }, []);

  useEffect(() => {
    if (!qrcode) return;

    const timer = setInterval(async () => {
      const used = await getQrCodeState(qrcode.id);

      if (used) {
        clearTimeout(timer);
        setQrcode(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [qrcode]);

  if (qrcode)
    return (
      <div className="container">
        {suspense(<LazyReceiveQrCode qrcode={qrcode} />)}

        {suspense(<LazyFloatButtons onClick={toHome} />)}
      </div>
    );
  else if (progressList.empty() && !fileList.length) {
    return (
      <>
        <Flex vertical align="center" style={{ height: "100vh", padding: 0 }}>
          {suspense(<LazyReceiveHeader />)}
          <Flex style={{ flexGrow: 14 }} align="center" justify="center">
            <Empty description="请在手机端上传文件" />
          </Flex>
        </Flex>

        {suspense(<LazyFloatButtons onClick={toHome} />)}
      </>
    );
  }

  return (
    <>
      <Flex vertical style={{ height: "100vh" }}>
        {suspense(<LazyReceiveHeader />)}

        <ul className="receive-file-list">
          {fileList.map((t) => (
            <FileListItem
              key={t.name}
              name={t.name}
              percent={100}
              size={t.size}
            />
          ))}

          {progressList.map((progress) => (
            <FileListItem
              key={progress.name}
              name={progress.name}
              percent={Math.round(progress.percent)}
              speed={progress.speed}
              size={progress.size}
            />
          ))}
        </ul>
      </Flex>

      {suspense(
        <LazyFloatButtons
          onClick={toHome}
          clear={() => {
            setProgressList(new OrderedSet("name"));
            setFileList([]);
          }}
        />,
      )}
    </>
  );
};

export default Receive;
