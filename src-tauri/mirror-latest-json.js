import fs from "fs";
import path from "path";

const run = async ({ release_id, context }) => {
  const text = process.env.TEXT;
  const mirror = text.replaceAll(
    "https://github.com/",
    "https://kkgithub.com/",
  );

  const dir = process.cwd();

  const filepath = path.join(dir, "latest.json");

  console.log("mirror latest json path: ", filepath);

  fs.writeFileSync(path.join(dir, versionFilename), mirror);
};
