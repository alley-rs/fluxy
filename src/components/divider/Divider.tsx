import {
  type Component,
  type JSX,
  mergeProps,
  Show,
  splitProps,
} from "solid-js";
import * as styles from "./Divider.css";

interface DividerProps extends JSX.HTMLAttributes<HTMLHRElement> {
  /**
   * 分隔线方向
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * 分隔线尺寸
   * @default "md"
   */
  size?: "sm" | "md" | "lg";

  /**
   * 分隔线文字内容
   */
  children?: JSX.Element;

  /**
   * 文字位置
   * 水平分隔线: start(靠左) | center(居中) | end(靠右)
   * 垂直分隔线: start(靠上) | center(居中) | end(靠下)
   * @default "center"
   */
  textPosition?: "start" | "center" | "end";
}

const Divider: Component<DividerProps> = (props) => {
  const merged = mergeProps(
    {
      orientation: "horizontal",
      size: "md",
      textPosition: "center",
    } as const,
    props,
  );

  const [local, others] = splitProps(merged, [
    "orientation",
    "size",
    "children",
    "textPosition",
    "class",
    "classList",
  ]);

  // 如果有子元素，则渲染带文字的分隔线
  const hasChildren = () => !!local.children;

  return (
    <Show
      when={hasChildren()}
      fallback={
        <hr
          classList={{
            [styles.dividerBase]: true,
            [styles.horizontal]: local.orientation === "horizontal",
            [styles.vertical]: local.orientation === "vertical",
            [styles.dividerSizeStyles[local.size]]: true,
            [local.orientation === "horizontal"
              ? styles.dividerVariants[local.size]
              : styles.verticalVariants[local.size]]: true,
            [local.class || ""]: !!local.class,
            ...local.classList,
          }}
          {...others}
        />
      }
    >
      <div
        classList={{
          [styles.withTextContainer]: true,
          [local.orientation === "horizontal"
            ? styles.withTextHorizontal
            : styles.withTextVertical]: true,
          [local.orientation === "horizontal"
            ? styles.withTextHorizontalPosition[local.textPosition]
            : styles.withTextVerticalPosition[local.textPosition]]: true,
          [local.class || ""]: !!local.class,
          ...local.classList,
        }}
      >
        <span class={styles.withTextContent}>{local.children}</span>
      </div>
    </Show>
  );
};

export default Divider;
