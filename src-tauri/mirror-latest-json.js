import fs from "fs";
import path from "path";

const run = async () => {
  const text = process.env.TEXT;
  const mirror = text.replaceAll(
    "https://github.com/",
    "https://kkgithub.com/",
  );

  const json = JSON.parse(mirror);

  const dir = process.cwd();

  const filepath = path.join(dir, "latest.json");

  fs.writeFileSync(filepath, JSON.stringify(json));
};

run();
