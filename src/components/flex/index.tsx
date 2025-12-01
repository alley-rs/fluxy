import { mergeProps, splitProps, type JSX } from "solid-js";

import * as styles from "./index.css";

type Position = "center" | "start" | "end" | "normal";

export interface FlexProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    "style" | "children" | "class"
  > {
  justify?: Position | "round" | "between" | "stretch" | "evenly";
  align?: Position;
  flex?: number;
  direction?: "horizontal" | "vertical";
  inline?: boolean;
  gap?: "sm" | "md" | "lg" | number;
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  style?: JSX.CSSProperties;
  children: JSX.Element;
  class?: string;
}

const Flex = (props: FlexProps) => {
  const merged = mergeProps(
    {
      direction: "horizontal",
      justify: "normal",
      align: "normal",
      wrap: "wrap",
    } as const,
    props,
  );

  const [local, others] = splitProps(merged, [
    "children",
    "style",
    "justify",
    "align",
    "flex",
    "direction",
    "gap",
    "inline",
    "wrap",
    "class",
  ]);

  const classList = () => ({
    [styles.flex]: !local.inline,
    [styles.inline]: local.inline,
    [styles.justifyVariants[local.justify]]: true,
    [styles.alignVariants[local.align]]: true,
    [styles.directionVariants[local.direction]]: true,
    [styles.gapVariants[local.gap as "sm" | "md" | "lg"]]:
      typeof local.gap === "string",
    [styles.wrapVariants[local.wrap]]: true,
    [local.class ?? ""]: !!local.class,
  });

  const style = (): JSX.CSSProperties | undefined => {
    const stl = { ...local.style };

    if (props.flex) stl.flex = props.flex;

    if (props.gap && typeof props.gap === "number") {
      stl["row-gap"] = `${props.gap}px`;
      stl["column-gap"] = `${props.gap}px`;
    }

    return stl;
  };

  return (
    <div classList={classList()} style={style()} {...others}>
      {local.children}
    </div>
  );
};

export default Flex;
