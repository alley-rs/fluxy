import { AiOutlineFileUnknown } from "solid-icons/ai";
import {
  BiLogosCPlusPlus,
  BiLogosGoLang,
  BiLogosJavascript,
  BiLogosPython,
  BiLogosReact,
  BiLogosTypescript,
} from "solid-icons/bi";
import {
  BsAndroid2,
  BsFileCode,
  BsFileImage,
  BsFilePdf,
  BsFileZip,
  BsFiletypeCss,
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypeExe,
  BsFiletypeGif,
  BsFiletypeHtml,
  BsFiletypeJava,
  BsFiletypeJpg,
  BsFiletypeJson,
  BsFiletypeMov,
  BsFiletypeMp3,
  BsFiletypeMp4,
  BsFiletypePhp,
  BsFiletypePng,
  BsFiletypePpt,
  BsFiletypePptx,
  BsFiletypeScss,
  BsFiletypeSql,
  BsFiletypeSvg,
  BsFiletypeTxt,
  BsFiletypeXls,
  BsFiletypeXlsx,
  BsFiletypeXml,
  BsMarkdown,
  BsWindows,
  BsFiletypeTtf,
  BsFiletypeOtf,
  BsFiletypeWoff,
  BsFiletypeCsv,
  BsFileMusicFill,
  BsBookFill,
  BsFiletypeWav,
} from "solid-icons/bs";
import {
  FaBrandsAppStore,
  FaBrandsLinux,
  FaSolidFileVideo,
} from "solid-icons/fa";
import {
  SiDebian,
  SiLua,
  SiOpenwrt,
  SiRust,
  SiToml,
  SiAdobephotoshop,
  SiYaml,
  SiSqlite,
  SiCsharp,
  SiGnubash,
} from "solid-icons/si";
import {
  RiDocumentNumbersFill,
  RiDocumentPagesFill,
  RiDocumentKeynoteFill,
} from "solid-icons/ri";

const FileTypeIcon = (ext: string) => {
  switch (ext) {
    /* 视频 */
    case "MP4":
      return <BsFiletypeMp4 />;
    case "MOV":
      return <BsFiletypeMov />;
    case "WEBM":
    case "FLV":
    case "MKV":
      return <FaSolidFileVideo />;

    /* 音频 */
    case "MP3":
      return <BsFiletypeMp3 />;
    case "WAV":
      return <BsFiletypeWav />;
    case "FLAC":
    case "APE":
      return <BsFileMusicFill />;

    /* 图片 */
    case "JPG":
    case "JPEG":
      return <BsFiletypeJpg />;
    case "GIF":
      return <BsFiletypeGif />;
    case "PNG":
    case "APNG":
      return <BsFiletypePng />;
    case "SVG":
      return <BsFiletypeSvg />;
    case "PSD":
      return <SiAdobephotoshop />;
    case "WEBP":
    case "AVIF":
    case "ICNS":
      return <BsFileImage />;

    /* 文档 */
    case "PDF":
      return <BsFilePdf />;
    case "NUMBERS":
      return <RiDocumentNumbersFill />;
    case "PAGES":
      return <RiDocumentPagesFill />;
    case "KEYNOTE":
      return <RiDocumentKeynoteFill />;
    case "MD":
      return <BsMarkdown />;
    case "PPT":
      return <BsFiletypePpt />;
    case "PPTX":
      return <BsFiletypePptx />;
    case "XLS":
      return <BsFiletypeXls />;
    case "XLSX":
      return <BsFiletypeXlsx />;
    case "DOC":
      return <BsFiletypeDoc />;
    case "DOCX":
      return <BsFiletypeDocx />;
    case "CSV":
      return <BsFiletypeCsv />;

    /* 电子书 */
    case "EPUB":
    case "MOBI":
      return <BsBookFill />;

    /* 压缩文件 */
    case "ZIP":
    case "RAR":
    case "7Z":
    case "TAR":
    case "GZ":
      return <BsFileZip />;

    /* 应用程序 */
    case "DMG":
    case "IPA":
      return <FaBrandsAppStore />;
    case "EXE":
      return <BsFiletypeExe />;
    case "MSI":
      return <BsWindows />;
    case "APK":
      return <BsAndroid2 />;
    case "APPIMAGE":
      return <FaBrandsLinux />;
    case "DEB":
      return <SiDebian />;

    /* 路由固件 */
    case "IPK":
      return <SiOpenwrt />;

    /* 代码文件 */
    case "SH":
      return <SiGnubash />;
    case "PY":
      return <BiLogosPython />;
    case "JS":
      return <BiLogosJavascript />;
    case "JSX":
      return <BiLogosReact />;
    case "TS":
      return <BiLogosTypescript />;
    case "TSX":
      return <BiLogosReact />;
    case "RS":
      return <SiRust />;
    case "CPP":
      return <BiLogosCPlusPlus />;
    case "JAVA":
    case "JAR":
      return <BsFiletypeJava />;
    case "LUA":
      return <SiLua />;
    case "CSS":
      return <BsFiletypeCss />;
    case "GO":
      return <BiLogosGoLang />;
    case "SCSS":
      return <BsFiletypeScss />;
    case "PHP":
      return <BsFiletypePhp />;
    case "SQL":
      return <BsFiletypeSql />;
    case "CS":
      return <SiCsharp />;
    case "C":
      return <BsFileCode />;
    case "JSON":
      return <BsFiletypeJson />;
    case "TOML":
      return <SiToml />;
    case "HTML":
      return <BsFiletypeHtml />;
    case "XML":
      return <BsFiletypeXml />;
    case "YML":
    case "YAML":
      return <SiYaml />;
    case "TXT":
      return <BsFiletypeTxt />;

    /* 字体文件 */
    case "TTF":
      return <BsFiletypeTtf />;
    case "OTF":
      return <BsFiletypeOtf />;
    case "WOFF":
      return <BsFiletypeWoff />;

    /* 数据库 */
    case "SQLITE":
    case "DB":
      return <SiSqlite />;

    default:
      return <AiOutlineFileUnknown />;
  }
};

export default FileTypeIcon;
