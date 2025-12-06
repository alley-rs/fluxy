interface FileType {
  extensions: string[];
  name: string;
}

const FILE_TYPES: FileType[] = [
  {
    extensions: ["JPG", "JPEG", "PNG", "GIF", "WEBP", "BMP", "SVG", "ICNS"],
    name: "图片",
  },
  {
    extensions: ["MKV", "MP4", "AVI", "MOV"],
    name: "视频",
  },
  {
    extensions: ["MP3", "FLAC"],
    name: "音频",
  },
  {
    extensions: [
      "DOC",
      "DOCX",
      "PPT",
      "PPTX",
      "XLS",
      "XLSX",
      "PAGES",
      "NUMBERS",
      "KEYNOTES",
      "MD",
      "PDF",
    ],
    name: "文档",
  },
  {
    extensions: ["TXT", "YAML", "YML", "TOML", "INI", "JSON", "HTML"],
    name: "文本",
  },
  {
    extensions: ["ZIP", "RAR", "7Z", "TAR"],
    name: "压缩文件",
  },
  {
    extensions: [
      "PY",
      "RUST",
      "TS",
      "TSX",
      "JS",
      "JSX",
      "SCSS",
      "CSS",
      "LESS",
      "JAVA",
      "LUA",
      "CJS",
      "CPP",
      "C",
      "GO",
    ],
    name: "代码文件",
  },
  {
    extensions: ["APK", "EXE", "MSI", "DMG", "IPA", "DEB", "RPM", "APPIMAGE"],
    name: "应用程序",
  },
];

const fileType = (extension: string) => {
  const ft = FILE_TYPES.find((ft) => ft.extensions.includes(extension));

  return ft ? ft.name : "未知";
};

export default fileType;
