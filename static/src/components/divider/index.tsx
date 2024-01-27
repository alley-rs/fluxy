import { mergeProps, type JSXElement } from "solid-js";
import { addClassNames } from "../utils";
import "./index.scss";

interface DividerProps {
  class?: string;
  children?: JSXElement;
  direction?: "horizontal" | "vertical";
  contentPosition?: "center" | "left" | "right";
}

const baseClassName = "divider";

const Divider = (props: DividerProps) => {
  const merged = mergeProps(
    { direction: "horizontal", contentPosition: "center" },
    props,
  );

  const classNames = () =>
    addClassNames(
      baseClassName,
      merged.class,
      `${baseClassName}-${merged.direction}`,
      `${baseClassName}-${merged.contentPosition}`,
    );

  return <div class={classNames()}>{merged.children}</div>;
};

export default Divider;
