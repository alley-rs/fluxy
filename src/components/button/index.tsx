import { mergeProps, type JSXElement } from "solid-js";
import { addClassNames } from "~/components/utils/class";
import "./index.scss";

type ButtonType = "default" | "plain";
type ButtonShape = "square" | "circle";

interface Filter {
  scale: number;
}

export interface ButtonProps {
  class?: string;
  children?: string;
  icon?: JSXElement;
  block?: boolean;
  disabled?: boolean;
  shape?: ButtonShape;
  type?: ButtonType;
  onClick?: (event: MouseEvent) => void;
  style?: CSSProperties;
  filter?: boolean | Filter;
  danger?: boolean;
}

const baseClassName = "alley-button";

const Button = (props: ButtonProps) => {
  const merged = mergeProps({ filter: { scale: 1.1 } }, props);

  const className = () =>
    addClassNames(
      baseClassName,
      merged.block ? "block" : "",
      merged.disabled ? "disabled" : "",
      merged.shape || "",
      merged.type || "",
      merged.filter && `${baseClassName}-filter`,
      merged.danger && `${baseClassName}-danger`,
      merged.class || "",
    );

  const style = () => {
    if (!merged.filter || merged.filter === true) return merged.style;

    return {
      "--filter-scale": merged.filter.scale,
      ...merged.style,
    };
  };

  const children =
    merged.icon && merged.children ? (
      <>
        {merged.icon}&nbsp;{merged.children}
      </>
    ) : (
      merged.icon || merged.children
    );

  return (
    <button
      class={className()}
      onClick={merged.onClick}
      disabled={merged.disabled}
      style={style()}
    >
      {children}
    </button>
  );
};

export default Button;
