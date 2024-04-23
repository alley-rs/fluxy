import { Show } from "solid-js";
import { open } from "@tauri-apps/plugin-shell";
import { AiFillCheckCircle } from "solid-icons/ai";
import fileType from "./fileType";
import {
  LazyLink,
  LazyListItem,
  LazyProgress,
  LazySpace,
  LazyTooltip,
  LazyTypographyText,
} from "~/lazy";

interface FileListItemProps {
  index?: number;
  path: string;
  name: string;
  percent: number;
  speed?: number;
  size: string;
}

const FileListItem = (props: FileListItemProps) => {
  const extension = getExtension(props.name);

  return (
    <LazyListItem
      class="receive-file-list-item"
      title={
        <span class="filename">
          {props.index !== undefined ? (
            <span class="label">{props.index + 1}.</span>
          ) : null}

          <Show
            when={props.percent === 100}
            fallback={
              <LazyTypographyText disabled>{props.name}</LazyTypographyText>
            }
          >
            <LazyTooltip text="单击使用默认程序打开此文件" placement="top">
              <LazyLink onClick={() => open(props.path)}>{props.name}</LazyLink>
            </LazyTooltip>
          </Show>
        </span>
      }
      description={
        <LazySpace gap={24}>
          <span>大小: {props.size}</span>
          <span>类型：{fileType(extension)}</span>
        </LazySpace>
      }
      extra={
        props.speed ? (
          <span class="speed">{props.speed.toFixed(1)} MB/s</span>
        ) : (
          <span class="done">
            <AiFillCheckCircle />
          </span>
        )
      }
      foot={<LazyProgress percent={props.percent} />}
    />
  );
};

const getExtension = (name: string): string => {
  const dotIndex = name.lastIndexOf(".");

  if (dotIndex === -1) return "UNKOWN";

  return name.slice(dotIndex + 1).toUpperCase();
};

export default FileListItem;
