import { useState, useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { TauriEvent } from "@tauri-apps/api/event";
import { Avatar, Button, Empty, Flex, List, Space } from "antd";
import "./index.scss";
import {
  AndroidOutlined,
  AppleOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  FileGifOutlined,
  FileImageOutlined,
  FileJpgOutlined,
  FileMarkdownOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
  FileZipOutlined,
  VideoCameraOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { getFilesMetadata, getSendFilesUrlQrCode, getQrCodeState } from "~/api";

const avatar = (ext: string) => {
  switch (ext) {
    case "MP4":
    case "MOV":
    case "AVI":
    case "WEBM":
      return <VideoCameraOutlined />;
    case "JPG":
    case "JPEG":
      return <FileJpgOutlined />;
    case "GIF":
      return <FileGifOutlined />;
    case "PNG":
    case "WEBP":
    case "AVIF":
    case "SVG":
      return <FileImageOutlined />;
    case "PDF":
      return <FilePdfOutlined />;
    case "MP3":
      return <CustomerServiceOutlined />;
    case "MD":
      return <FileMarkdownOutlined />;
    case "PPT":
      return <FilePptOutlined />;
    case "XLS":
    case "XLSX":
      return <FileExcelOutlined />;
    case "DOC":
    case "DOCX":
      return <FileWordOutlined />;
    case "ZIP":
    case "RAR":
    case "7Z":
    case "TAR":
      return <FileZipOutlined />;
    case "DMG":
    case "IPA":
      return <AppleOutlined />;
    case "EXE":
    case "MSI":
      return <WindowsOutlined />;
    case "APK":
      return <AndroidOutlined />;
    case "PY":
    case "JS":
    case "JSX":
    case "TS":
    case "TSX":
    case "RS":
    case "CPP":
    case "CSS":
    case "SCSS":
      return <CodeOutlined />;
    case "TXT":
    case "JSON":
    case "YAML":
    case "TOML":
    case "HTML":
    case "XML":
    case "YML":
      return <FileTextOutlined />;
    default:
      return <FileUnknownOutlined />;
  }
};

const Send = () => {
  const [files, setFiles] = useState<SendFile[] | null>(null);

  const [qrcode, setQrcode] = useState<QrCode | null>(null);

  const deleteRepetition = (paths: string[]): string[] => {
    return paths.filter((p) => {
      const index = files?.findIndex((f) => f.path === p);
      return index === undefined ? true : index === -1;
    });
  };

  useEffect(() => {
    const unlisten = appWindow.listen<string[]>(
      TauriEvent.WINDOW_FILE_DROP,
      async (e) => {
        const paths = deleteRepetition(e.payload);
        const sendFiles = await getFilesMetadata(paths);

        setFiles((pre) => {
          return pre ? [...pre, ...sendFiles] : sendFiles;
        });
      },
    );

    return () => {
      unlisten.then((f) => f());
    };
  }, [files]);

  useEffect(() => {
    if (!qrcode) return;

    const timer = setInterval(async () => {
      const used = await getQrCodeState(qrcode.id);

      if (used) {
        clearTimeout(timer);
        setQrcode(null);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      location.reload();
    };
  }, [qrcode]);

  const removeFile = (path: string) =>
    setFiles((pre) => pre!.filter((f) => f.path !== path));

  const newSendFilesQrCode = async () => {
    const code = await getSendFilesUrlQrCode(files!);
    setQrcode(code);
  };

  if (qrcode) {
    return (
      <div className="container">
        <h2>扫码连接</h2>
        <div dangerouslySetInnerHTML={{ __html: qrcode.svg }} />
      </div>
    );
  }

  return (
    <>
      <Flex className="file-list-container" vertical>
        <Flex
          className="file-list"
          flex={1}
          justify={files?.length ? undefined : "center"}
          align={files?.length ? undefined : "center"}
          vertical
        >
          {files && files.length ? (
            <List
              style={{ padding: "0 5px" }}
              itemLayout="horizontal"
              dataSource={files}
              renderItem={(item, index) => (
                <List.Item
                  key={index}
                  actions={[
                    <a
                      className="delete-button"
                      onClick={() => removeFile(item.path)}
                    >
                      {<DeleteOutlined />}{" "}
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={avatar(item.extension)} />}
                    title={item.name}
                    description={<Space>大小:{item.size}</Space>}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="将文件拖到此处" />
          )}
        </Flex>

        <Button
          style={{ marginTop: 10 }}
          disabled={!files?.length}
          onClick={newSendFilesQrCode}
        >
          确认
        </Button>
      </Flex>
    </>
  );
};

export default Send;
