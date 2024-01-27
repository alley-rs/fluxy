import type { JSXElement } from "solid-js";
import { addClassNames } from "~/components/utils/class";
import "./index.scss";

type Position = "center" | "start" | "end";

interface FlexProps {
  class?: string;
  justify?: Position;
  align?: Position;
  children: JSXElement;
  flex?: number;
  direction?: "horizontal" | "vertical";
  style?: CSSProperties;
}

const baseClassName = "flex";

const Flex = (props: FlexProps) => {
  const className = () =>
    addClassNames(
      baseClassName,
      props.class || "",
      props.justify ? `${baseClassName}__justify-${props.justify}` : "",
      props.align ? `${baseClassName}__align-${props.align}` : "",
      props.direction
        ? `${baseClassName}__${props.direction}`
        : `${baseClassName}__horizontal`,
    );

  const style: () => CSSProperties = () =>
    props.flex
      ? { ...props.style, flex: `${props.flex} ${props.flex} auto` }
      : props.style;

  return (
    <div class={className()} style={style()}>
      {props.children}
    </div>
  );
};

export default Flex;
