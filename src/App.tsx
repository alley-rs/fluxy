import { useEffect, useState } from "react";
import { Button, Empty, Progress, Dropdown, Row, Col } from "antd";
import type { MenuProps } from "antd";
import { appWindow } from "@tauri-apps/api/window";
import { OrderedSet } from "~/utils";
import "./App.scss";
import {
  changeDownloadsDir,
  getDownloadsDir,
  getLocalIPQrCode,
  getQrCodeState,
} from "./api";
import { open } from "@tauri-apps/api/shell";
import { open as pick } from "@tauri-apps/api/dialog";

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
  const [downloadDir, setDownloadDir] = useState<string | undefined>(undefined);

  const [qrcode, setQrcode] = useState<QrCode | null>(null);

  const [progressList, setProgressList] = useState<OrderedSet<TaskMessage>>(
    new OrderedSet("name"),
  );
  const [fileList, setFileList] = useState<TaskMessage[]>([]);

  const [openDropDown, setOpenDropDown] = useState(false);

  useEffect(() => {
    if (downloadDir) return;

    getDownloadsDir().then((d) => setDownloadDir(d));
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

    getLocalIPQrCode().then((c) => setQrcode(c));
  }, []);

  useEffect(() => {
    if (!qrcode) return;

    const query = async () => {
      const timer = setInterval(async () => {
        const used = await getQrCodeState(qrcode.id);

        if (used) {
          clearTimeout(timer);
          setQrcode(null);
        }
      }, 500);
    };

    query();
  }, [qrcode]);

  const pickDirectory = async () => {
    const dir = (await pick({
      directory: true,
      defaultPath: downloadDir,
      multiple: false,
    })) as string | null;

    if (!dir) return;

    await changeDownloadsDir(dir);

    setDownloadDir(dir);
  };

  const DirectoryDropdownItems: MenuProps["items"] = [
    {
      key: "1",
      label: <a>打开</a>,
      onClick: () => open(downloadDir!),
    },
    {
      key: "2",
      label: <a>修改</a>,
      onClick: () => pickDirectory(),
    },
  ];

  return (
    <>
      {downloadDir && !qrcode ? (
        <Row className="header">
          <Col span={5} className="directory-button-label">
            <span style={{ fontSize: "0.8rem" }}>保存目录：</span>
          </Col>

          <Col span={19}>
            <Dropdown
              open={openDropDown}
              onOpenChange={() => setOpenDropDown((pre) => !pre)}
              menu={{ items: DirectoryDropdownItems }}
              placement="bottomRight"
              arrow
              overlayStyle={{ minWidth: 0 }}
            >
              <Button
                className="directory-button"
                type="link"
                onClick={async () => {
                  setOpenDropDown(false);
                  open(downloadDir);
                }}
                style={{ textOverflow: "ellipsis" }}
              >
                {downloadDir}
              </Button>
            </Dropdown>
          </Col>
        </Row>
      ) : null}

      <div className="container">
        {progressList.empty() && !qrcode && !fileList.length ? (
          <Empty description="请在手机端上传文件" />
        ) : (
          fileList.map((t) => (
            <FileListItem key={t.name} name={t.name} percent={100} />
          ))
        )}

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
            <Button type="link" onClick={async () => await open(qrcode.url)}>
              {qrcode.url}
            </Button>
          </>
        ) : null}
      </div>
    </>
  );
};

export default App;
