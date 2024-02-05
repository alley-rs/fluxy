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
} from "solid-icons/bs";
import { FaBrandsAppStore, FaBrandsLinux } from "solid-icons/fa";
import { ImFileVideo } from "solid-icons/im";
import { SiDebian, SiLua, SiOpenwrt, SiRust, SiToml } from "solid-icons/si";
import { TbBrandCSharp } from "solid-icons/tb";

const FileTypeIcon = (ext: string) => {
  switch (ext) {
    case "MP4":
      return <BsFiletypeMp4 />;
    case "MOV":
      return <BsFiletypeMov />;
    case "WEBM":
      return <ImFileVideo />;
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
    case "WEBP":
    case "AVIF":
    case "ICNS":
      return <BsFileImage />;
    case "PDF":
      return <BsFilePdf />;
    case "MP3":
      return <BsFiletypeMp3 />;
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
    case "ZIP":
    case "RAR":
    case "7Z":
    case "TAR":
    case "GZ":
      return <BsFileZip />;
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
    case "IPK":
      return <SiOpenwrt />;
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
    case "TXT":
    case "YML":
    case "YAML":
      return <BsFiletypeTxt />;
    case "TOML":
      return <SiToml />;
    case "HTML":
      return <BsFiletypeHtml />;
    case "XML":
      return <BsFiletypeXml />;
    default:
      return <AiOutlineFileUnknown />;
  }
};

export default FileTypeIcon;
