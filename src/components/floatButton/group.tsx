import { For } from "solid-js";
import type { FloatGroupProps } from "./interface";
import FloatButton from "./button";

const FloatGroup = (props: FloatGroupProps) => {
  return (
    <div
      class="float-button-group"
      style={{
        "--right": `${props.right ?? 20}px`,
        "--bottom": `${props.bottom ?? 20}px`,
      }}
    >
      <For each={props.options}>
        {(option) => <FloatButton {...option} class="group-item" />}
      </For>
    </div>
  );
};

export default FloatGroup;
