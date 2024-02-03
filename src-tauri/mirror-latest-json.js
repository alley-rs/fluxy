import fs from "fs";
import path from "path";

const run = async () => {
  const text = process.env.TEXT;
  let mirror = text.replaceAll(
    "https://github.com/",
    "https://kkgithub.com/",
  );

  // 删除开头和结尾的引号
  if (mirror[0] === '"') {
    mirror = mirror.slice(1)
  }

  if (mirror[mirror.length - 1] === '"') {
    mirror = mirror.slice(0, mirror.length -1);
  }


  const dir = process.cwd();

  const filepath = path.join(dir, "latest.json");

  fs.writeFileSync(filepath, mirror);
};

run();
