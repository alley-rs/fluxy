import { children, Show, useContext } from "solid-js";

import { AiOutlineCheck } from "solid-icons/ai";

import { open } from "@tauri-apps/plugin-shell";

import { AppContext } from "~/context";

import { LazyCard, LazyTooltip } from "~/lazy";

import fileType from "./fileType";

import { Progress } from "~/components/progress";
import Flex from "~/components/flex";
import { Badge } from "~/components/badge";

import * as styles from "./index.css";

interface FileListItemProps {
  index?: number;
  path: string;
  name: string;
  percent: number;
  speed?: number;
  size: string;
}

const FileListItem = (props: FileListItemProps) => {
  const { translations } = useContext(AppContext)!;

  const extension = getExtension(props.name);

  const title = children(() => (
    <span class="filename">
      {props.index !== undefined ? (
        <span class={styles.description}>{props.index + 1}.</span>
      ) : null}

      <Show
        when={props.percent === 100}
        fallback={
          <span classList={{ [styles.filename]: true }}>{props.name}</span>
        }
      >
        <LazyTooltip
          content={translations()!.receive_page_list_item_tooltip}
          position="top-start"
        >
          <span
            onClick={() => open(props.path)}
            classList={{
              [styles.filename]: true,
              [styles.filenameClickable]: true,
            }}
          >
            {props.name}
          </span>
        </LazyTooltip>
      </Show>
    </span>
  ));

  const description = children(() => (
    <Flex inline gap={24} class={styles.description}>
      <span>
        {translations()?.list_item_file_size_label}: {props.size}
      </span>
      <span>
        {translations()?.list_item_file_type_label}: {fileType(extension)}
      </span>
    </Flex>
  ));

  const speed = children(() =>
    props.speed ? (
      <span class={styles.description}>{props.speed.toFixed(1)} MB/s</span>
    ) : (
      <Badge
        content={<AiOutlineCheck />}
        variant="success"
        style={{ padding: 0 }}
      />
    )
  );

  return (
    <LazyCard style={{ overflow: "unset", margin: "8px" }}>
      <Flex
        direction="horizontal"
        justify="between"
        align="center"
        gap="md"
        style={{ "margin-bottom": "0.3rem" }}
      >
        <Flex direction="vertical" align="start">
          {title()}
          {description()}
        </Flex>

        {speed()}
      </Flex>

      <Progress value={props.percent} size="sm" />
    </LazyCard>
  );
};

const getExtension = (name: string): string => {
  const dotIndex = name.lastIndexOf(".");

  if (dotIndex === -1) return "UNKOWN";

  return name.slice(dotIndex + 1).toUpperCase();
};

export default FileListItem;
