import {
  type Component,
  type JSX,
  mergeProps,
  Show,
  splitProps,
} from "solid-js";
import { spinner } from "~/themes/global.css";
import * as styles from "./Button.css";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "text";
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "rounded" | "square";
  disabled?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
  icon?: JSX.Element;
  onClick?: () => void;
  children?: JSX.Element;
}

export const Button: Component<ButtonProps> = (props) => {
  const merged = mergeProps(
    { variant: "secondary", size: "md", shape: "rounded" } as const,
    props,
  );

  const [local, others] = splitProps(merged, [
    "variant",
    "size",
    "shape",
    "disabled",
    "loading",
    "iconOnly",
    "icon",
    "onClick",
    "children",
    "class",
    "classList",
  ]);

  const classList = () => ({
    [styles.buttonBase]: true,
    [styles.buttonVariant[local.variant]]: true,
    [styles.buttonSize[local.size]]: true,
    [styles.buttonShape[local.shape]]: true,
    [styles.iconOnly]: local.iconOnly,
    ...local.classList,
    [local.class || ""]: !!local.class,
  });

  return (
    <button
      classList={classList()}
      disabled={local.disabled || local.loading}
      onClick={local.onClick}
      {...others}
    >
      <Show when={local.loading}>
        <span class={spinner} />
      </Show>

      <Show when={!local.loading && local.icon}>{local.icon}</Show>

      <Show when={!local.iconOnly}>{local.children}</Show>
    </button>
  );
};
