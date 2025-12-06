import { type Component, type JSX, mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import * as styles from "./Text.css";

interface TextProps extends JSX.HTMLAttributes<HTMLElement> {
  /**
   * 文本类型
   * - h1-h5: 标题类型，带有文本阴影效果
   * - body: 正文
   * - subtitle: 副标题
   * - caption: 说明文字
   * - small: 小字
   */
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "body"
    | "subtitle"
    | "caption"
    | "small";
  /**
   * 文本内容
   */
  children?: JSX.Element;
}

export const Text: Component<TextProps> = (props) => {
  const merged = mergeProps({ variant: "body" } as const, props);

  const [local, others] = splitProps(merged, [
    "variant",
    "children",
    "class",
    "classList",
  ]);

  // 根据 variant 选择合适的 HTML 标签
  const getTag = () => {
    switch (local.variant) {
      case "h1":
        return "h1";
      case "h2":
        return "h2";
      case "h3":
        return "h3";
      case "h4":
        return "h4";
      case "h5":
        return "h5";
      case "caption":
        return "span";
      case "small":
        return "small";
      case "subtitle":
        return "h6";
      default:
        return "p";
    }
  };

  return (
    <Dynamic
      component={getTag()}
      classList={{
        [styles.textBase]: true,
        [styles.textVariants[local.variant]]: true,
        [local.class || ""]: !!local.class,
        ...local.classList,
      }}
      children={local.children}
      {...others}
    />
  );
};
