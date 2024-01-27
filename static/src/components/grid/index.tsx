import type { JSXElement } from "solid-js";
import { addClassNames } from "../utils";
import "./index.scss";
import GridItem from "./item";

interface GridProps {
  class?: string;
  style?: CSSProperties;
  columns: number;
  gap?: number;
  children: JSXElement;
}

const baseClassName = "grid";

const Grid = (props: GridProps) => {
  const classNames = () => addClassNames(baseClassName, props.class || "");

  const style: () => CSSProperties = () => ({
    "--columns": props.columns,
    "--gap": `${props.gap || 8}px`,
  });

  return (
    <div class={classNames()} style={style()}>
      {props.children}
    </div>
  );
};

Grid.Item = GridItem;

export default Grid;
