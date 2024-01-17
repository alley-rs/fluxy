import { Grid, Space } from "antd-mobile";
import fileType from "~/pages/receive/fileType";
import formatFileSize from "./fileSize";

const getExtension = (name: string): string => {
  const dotIndex = name.lastIndexOf(".");

  if (dotIndex === -1) return "UNKOWN";

  return name.slice(dotIndex + 1).toUpperCase();
};

interface FileItemProps {
  file: File;
  speed?: number;
  percent?: number;
}

const FileItem = ({ file, speed, percent }: FileItemProps) => {
  const extension = getExtension(file.name);

  const fillStyle = {
    width: `${percent ?? 0}%`,
  };

  const uploading = percent && percent < 100;

  return (
    <li className={"file-list-item" + (percent === 100 ? " success" : "")}>
      <div className="progress-bar">
        <div className={"progress-bar-trail"}>
          <div
            className={
              percent === 100
                ? " progress-bar-fill-success"
                : "progress-bar-fill"
            }
            style={fillStyle}
          />
        </div>
      </div>
      <Grid columns={10} className="file-detail">
        <Grid.Item span={7}>
          <h3 className="filename">{file.name}</h3>
          <Space style={{ "--gap": "24px" }}>
            <span>大小：{formatFileSize(file.size)}</span>
            <span>
              类型：{fileType(extension)} - {extension}
            </span>
          </Space>
        </Grid.Item>

        {percent ? (
          <Grid.Item span={uploading ? 1 : 3} className="data">
            {Math.round(percent)}%
          </Grid.Item>
        ) : null}

        {uploading && speed ? (
          <Grid.Item span={2} className="data">
            {speed.toFixed(1)} MB/s
          </Grid.Item>
        ) : null}
      </Grid>
    </li>
  );
};

export default FileItem;
