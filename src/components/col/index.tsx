import type { JSXElement } from "solid-js";
import { addClassNames } from "../utils/class";
import "./index.scss";

type Span =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

interface ColProps {
  class?: string;
  style?: CSSProperties;
  gutter?: number;
  span?: Span;
  children: JSXElement;
}

const baseClassName = "col";

const Col = (props: ColProps) => {
  const className = () =>
    addClassNames(
      baseClassName,
      props.span ? `${baseClassName}-${props.span}` : "",
      props.class || "",
    );

  const style: () => CSSProperties = () =>
    props.gutter
      ? {
          ...props.style,
          "padding-left": props.gutter + "px",
          "padding-right": props.gutter + "px",
        }
      : props.style;

  return (
    <div class={className()} style={style()}>
      {props.children}
    </div>
  );
};

export default Col;
