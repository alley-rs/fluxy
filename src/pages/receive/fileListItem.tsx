import { Progress } from "antd";

interface FileListItemProps {
  name: string;
  percent: number;
  speed?: number;
}

const FileListItem = ({ name, percent, speed }: FileListItemProps) => (
  <div>
    <div
      style={{
        textAlign: "left",
        fontSize: "0.8rem",
        color: percent < 100 ? "#959595" : "var(--ant-color-text-base)",
      }}
    >
      {name}
      {speed ? `(${speed.toFixed(1)} MB/s)` : ""}
    </div>
    <Progress percent={percent} />
  </div>
);

export default FileListItem;
