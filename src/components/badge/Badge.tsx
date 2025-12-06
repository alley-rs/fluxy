import {
  type Component,
  type JSX,
  Show,
  mergeProps,
  splitProps,
} from "solid-js";
import * as styles from "./Badge.css";

interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  content?: JSX.Element;
  max?: number;
  dot?: boolean;
  showZero?: boolean;
  variant?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md";
  children?: JSX.Element;
  class?: string;
}

export const Badge: Component<BadgeProps> = (props) => {
  const merged = mergeProps(
    { variant: "error" as const, size: "md" as const, max: 99 },
    props,
  );
  const [local, others] = splitProps(merged, [
    "content",
    "max",
    "dot",
    "showZero",
    "variant",
    "size",
    "children",
    "class",
  ]);

  const displayContent = () => {
    if (local.dot) return null;
    if (typeof local.content === "number" && local.content > local.max) {
      return `${local.max}+`;
    }
    return local.content;
  };

  const isHidden = () => {
    if (!local.showZero && local.content === 0 && !local.dot) return true;
    if (local.content === undefined && !local.dot) return true;
    return false;
  };

  return (
    <div class={styles.badgeWrapper}>
      {local.children}
      <Show when={!isHidden()}>
        <span
          class={styles.badgeBase}
          classList={{
            [styles.badgePosition]: !!local.children,
            [styles.badgeDot]: local.dot,
            [styles.badgeSize[local.size]]: !local.dot,
            [styles.badgeVariant[local.variant]]: true,
            [local.class || ""]: !!local.class,
          }}
          {...others}
        >
          {displayContent()}
        </span>
      </Show>
    </div>
  );
};
