import fs from "fs";
import path from "path";

const mirrors = [
  { host: "mirror.ghproxy.com", prefix: true },
  { host: "kkgithub.com" },
  { host: "521github.com" },
  { host: "hub.yzuu.cf" },
];

const GITHUB = "https://github.com/";

const mirrorContent = (mirror, text) => {
  if (mirror.prefix) {
    return text.replaceAll(
      GITHUB,
      `https://${mirror.host}/https://github.com/`,
    );
  } else {
    return text.replaceAll(GITHUB, `https://${mirror.host}/`);
  }
};

const newMirrorJSON = (text, mirror, filepath) => {
  const content = mirrorContent(mirror, text);
  fs.writeFileSync(filepath, content);
};

const run = async () => {
  let text = process.env.TEXT;

  // 删除开头和结尾的引号
  if (text[0] === '"') {
    text = text.slice(1);
  }

  if (text[text.length - 1] === '"') {
    text = text.slice(0, text.length - 1);
  }

  // 替换错误的换行符, 多个空格合并为一个空格
  text = text
    .replaceAll("\\n", "\n")
    .replaceAll('\\"', '"')
    .replaceAll(/\s+/g, " ");

  const currentDir = process.cwd();
  const targetDir = path.join(currentDir, "mirrors");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  mirrors.forEach((m, i) =>
    newMirrorJSON(text, m, path.join(targetDir, `latest-mirror-${i + 1}.json`)),
  );
};

run();
