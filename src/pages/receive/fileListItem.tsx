import { open } from "@tauri-apps/api/shell";
import Row from "~/components/row";
import Col from "~/components/col";
import Progress from "~/components/progress";

interface FileListItemProps {
  path: string;
  name: string;
  percent: number;
  speed?: number;
  size: string;
}

const FileListItem = (props: FileListItemProps) => (
  <li class="receive-file-list-item">
    <div
      style={{
        "text-align": "left",
        "font-size": "0.8rem",
        color: props.percent < 100 ? "#959595" : "var(--text-color)",
        position: "relative",
      }}
    >
      <Row gutter={2}>
        <Col span={props.speed ? 12 : 18} class="filename">
          <a onClick={() => open(props.path)}>{props.name}</a>
        </Col>

        {props.speed ? (
          <Col span={6} class="speed">{`${props.speed.toFixed(1)} MB/s`}</Col>
        ) : null}

        <Col span={6} class="filesize">
          {props.size}
        </Col>

        <Progress percent={props.percent} />
      </Row>
    </div>
  </li>
);

export default FileListItem;
