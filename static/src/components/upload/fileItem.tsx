import { AiFillCheckCircle } from "solid-icons/ai";
import fileType from "~/pages/receive/fileType";
import formatFileSize from "./fileSize";
import Space from "~/components/space";
import DotLoading from "~/components/loading/dot";
import List from "~/components/list";
import Progress from "../progress";

const getExtension = (name: string): string => {
  const dotIndex = name.lastIndexOf(".");

  if (dotIndex === -1) return "UNKOWN";

  return name.slice(dotIndex + 1).toUpperCase();
};

interface FileItemProps {
  index: number;
  file: File;
  speed?: number;
  percent?: number;
}

const FileItem = (props: FileItemProps) => {
  const extension = getExtension(props.file.name);

  return (
    <List.Item
      title={
        <span class="filename">
          <span class="label">{props.index + 1}.</span>
          {props.file.name}
        </span>
      }
      description={
        <Space gap={24}>
          <span>大小: {formatFileSize(props.file.size)}</span>
          <span>类型：{fileType(extension)}</span>
        </Space>
      }
      extra={
        props.speed ? (
          <span class="speed">{props.speed.toFixed(1)} MB/s</span>
        ) : props.percent === undefined ? (
          <span class="waiting">
            <DotLoading />
          </span>
        ) : (
          <span class="done">
            <AiFillCheckCircle />
          </span>
        )
      }
      foot={<Progress percent={props.percent} />}
    />
  );
};

export default FileItem;
