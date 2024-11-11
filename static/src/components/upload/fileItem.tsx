import { BsStopCircle } from "solid-icons/bs";
import { AiFillCheckCircle } from "solid-icons/ai";
import fileType from "~/pages/receive/fileType";
import formatFileSize from "./fileSize";
import Space from "~/components/space";
import DotLoading from "~/components/loading/dot";
import List from "~/components/list";
import Progress from "../progress";
import { Show, useContext } from "solid-js";
import LocaleContext from "~/context";
import ZH_CN from "~/i18n/zh_cn";

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
  abort?: () => void;
}

const FileItem = (props: FileItemProps) => {
  const locale = useContext(LocaleContext)!;
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
          <span>
            {locale.file_item_file_size_label}：
            {formatFileSize(props.file.size)}
          </span>
          <Show when={locale === ZH_CN}>
            <span>
              {locale.file_item_file_type_label}：{fileType(extension)}
            </span>
          </Show>
        </Space>
      }
      extra={
        props.speed ? (
          <Space
            class="uploading"
            direction="vertical"
            justify="center"
            align="center"
            gap={4}
          >
            <span class="abort" onClick={props.abort}>
              <BsStopCircle />
            </span>
            <span class="speed">{props.speed.toFixed(1)} MB/s</span>
          </Space>
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
