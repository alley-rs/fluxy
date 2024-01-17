import {
  AndroidOutlined,
  AppleOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
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
    case "APNG":
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

export default avatar;
