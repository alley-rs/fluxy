import { getOctokit } from "@actions/github";
import fs from "fs";
import path from "path";

module.exports = async ({ release_id, context }) => {
  const github = getOctokit(process.env.GITHUB_TOKEN);

  const { owner, repo } = context.repo;

  const versionFilename = "latest.json";

  const assets = await github.rest.repos.listReleaseAssets({
    owner: owner,
    repo: repo,
    release_id,
    per_page: 50,
  });
  const asset = assets.data.find((e) => e.name === versionFilename);

  if (!asset) throw new Error("latest.js was not found in release assets");

  const data = await github.request(
    "GET /repos/{owner}/{repo}/releases/assets/{asset_id}",
    {
      owner: owner,
      repo: repo,
      asset_id: asset.id,
      headers: {
        accept: "application/octet-stream",
      },
    },
  ).data;

  const text = Buffer.from(data).toString();
  const mirror = text.replaceAll(
    "https://github.com/",
    "https://kkgithub.com/",
  );

  const dir = process.cwd();

  const filepath = path.join(dir, versionFilename);

  console.log("mirror latest json path: ", filepath);

  fs.writeFileSync(path.join(dir, versionFilename), mirror);
};
