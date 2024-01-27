import "./index.scss";
import Image from "./image";
import type { JSXElement } from "solid-js";

interface EmptyProps {
  description?: JSXElement;
}

const Empty = (props: EmptyProps) => {
  return (
    <div class="empty">
      <div class="empty-image">{<Image />}</div>
      <div class="empty-description">{props.description || "暂无数据"}</div>
    </div>
  );
};

export default Empty;
