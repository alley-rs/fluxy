import type { JSXElement } from "solid-js";
import { addClassNames } from "../utils";

interface GridItemProps {
  class?: string;
  span: number;
  children: JSXElement;
}

const baseClassName = "grid-item";

const GridItem = (props: GridItemProps) => {
  const classNames = () => addClassNames(baseClassName, props.class || "");

  const style: () => CSSProperties = () => ({
    "--item-span": props.span,
  });

  return (
    <div class={classNames()} style={style()}>
      {props.children}
    </div>
  );
};

export default GridItem;
