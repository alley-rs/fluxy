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
} from "solid-icons/bs";
import { FaBrandsAppStore, FaBrandsLinux } from "solid-icons/fa";
import { ImFileVideo } from "solid-icons/im";
import {
  SiDebian,
  SiLua,
  SiOpenwrt,
  SiRust,
  SiToml,
  SiAdobephotoshop,
  SiYaml,
} from "solid-icons/si";
import { TbBrandCSharp } from "solid-icons/tb";
import {
  RiDocumentNumbersFill,
  RiDocumentPagesFill,
  RiDocumentKeynoteFill,
} from "solid-icons/ri";

const FileTypeIcon = (ext: string) => {
  switch (ext) {
    /* 音视频 */
    case "MP4":
      return <BsFiletypeMp4 />;
    case "MOV":
      return <BsFiletypeMov />;
    case "WEBM":
      return <ImFileVideo />;
    case "MP3":
      return <BsFiletypeMp3 />;

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
      return <TbBrandCSharp />;
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

    default:
      return <AiOutlineFileUnknown />;
  }
};

export default FileTypeIcon;
