import { open } from "@tauri-apps/api/shell";
import { suspense } from "~/advance";
import { LazyCol, LazyProgress, LazyRow } from "~/lazy";

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
      {suspense(
        <LazyRow gutter={2}>
          <LazyCol span={props.speed ? 12 : 18} class="filename">
            <a onClick={() => open(props.path)}>{props.name}</a>
          </LazyCol>

          {props.speed ? (
            <LazyCol span={6} class="speed">{`${props.speed.toFixed(
              1,
            )} MB/s`}</LazyCol>
          ) : null}

          <LazyCol span={6} class="filesize">
            {props.size}
          </LazyCol>

          <LazyProgress percent={props.percent} />
        </LazyRow>,
      )}
    </div>
  </li>
);

export default FileListItem;
