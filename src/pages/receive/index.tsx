import { useEffect, useState } from "react";
import { Button, Empty, Progress, Dropdown, Row, Col } from "antd";
import type { MenuProps } from "antd";
import { appWindow } from "@tauri-apps/api/window";
import { OrderedSet } from "~/utils";
import {
  changeDownloadsDir,
  getDownloadsDir,
  getUploadQrCode,
  getQrCodeState,
} from "~/api";
import { open } from "@tauri-apps/api/shell";
import { open as pick } from "@tauri-apps/api/dialog";
import "./index.scss";

interface FileListItemProps {
  name: string;
  percent: number;
  speed?: number;
}

const FileListItem = ({ name, percent, speed }: FileListItemProps) => (
  <div>
    <div
      style={{
        textAlign: "left",
        fontSize: "0.8rem",
        color: percent < 100 ? "#959595" : "var(--ant-color-text-base)",
      }}
    >
      {name}
      {speed ? `(${speed.toFixed(1)} MB/s)` : ""}
    </div>
    <Progress percent={percent} />
  </div>
);

const Receive = () => {
  const [downloadDir, setDownloadDir] = useState<string | undefined>(undefined);

  const [qrcode, setQrcode] = useState<QrCode | null>(null);

  const [progressList, setProgressList] = useState<OrderedSet<TaskMessage>>(
    new OrderedSet("name"),
  );
  const [fileList, setFileList] = useState<Omit<TaskMessage, "speed">[]>([]);

  const [openDropDown, setOpenDropDown] = useState(false);

  useEffect(() => {
    if (downloadDir) return;

    getDownloadsDir().then((d) => setDownloadDir(d));
  }, []);

  useEffect(() => {
    const unlisten = appWindow.listen<TaskMessage>("upload://progress", (e) => {
      if (qrcode) setQrcode(null);

      setProgressList((pre) => pre.push(e.payload));

      const { name, percent } = e.payload;

      if (percent === 100) {
        setProgressList((pre) => pre.remove(e.payload));

        setFileList((pre) => {
          const t = pre.find((v) => v.name === name);

          return t ? pre : [...pre, { name, percent }];
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
            percent={Math.round(progress.percent)}
            speed={progress.speed}
          />
        ))}

        {qrcode ? (
          <>
            <h2>扫码连接</h2>
            <div dangerouslySetInnerHTML={{ __html: qrcode.svg }} />

            <div>或在另一台电脑中通过浏览器中访问</div>
            <Button
              className="send-button"
              type="link"
              onClick={async () => await open(qrcode.url)}
            >
              {qrcode.url}
            </Button>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Receive;