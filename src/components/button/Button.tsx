import {
  type Component,
  createMemo,
  type JSX,
  mergeProps,
  Show,
  splitProps,
} from "solid-js";
import { spinner } from "~/themes/global.css";
import * as styles from "./Button.css";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "text";
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "rounded" | "square";
  disabled?: boolean;
  loading?: boolean;
  icon?: JSX.Element;
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
    "icon",
    "onClick",
    "children",
    "class",
    "classList",
  ]);

  const iconOnly = createMemo(() => !!local.icon && !local.children);

  const classList = () => {
    return {
      [styles.buttonBase]: true,
      [styles.buttonVariantSize[`${local.variant}-${local.size}`]]: true,
      [styles.buttonSizes[local.size]]: true,
      [styles.buttonShape[local.shape]]: true,
      [styles.iconOnly]: iconOnly(),
      [local.class || ""]: !!local.class,
      ...local.classList,
    };
  };

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

      <Show when={!iconOnly()}>{local.children}</Show>
    </button>
  );
};
