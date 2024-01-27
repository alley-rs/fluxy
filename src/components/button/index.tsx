import { type JSXElement } from "solid-js";
import { addClassNames } from "~/components/utils/class";
import "./index.scss";

type ButtonType = "default" | "danger";
type ButtonShape = "square" | "circle";

interface ButtonProps {
  class?: string;
  children?: string;
  icon?: JSXElement;
  block?: boolean;
  disabled?: boolean;
  shape?: ButtonShape;
  type?: ButtonType;
  onClick?: (event: MouseEvent) => void;
  style?: CSSProperties;
}

const baseClassName = "alley-button";

const Button = (props: ButtonProps) => {
  const className = () =>
    addClassNames(
      baseClassName,
      props.class || "",
      props.block ? "block" : "",
      props.disabled ? "disabled" : "",
      props.shape || "",
      props.type || "",
    );

  const children =
    props.icon && props.children ? (
      <>
        {props.icon}&nbsp;{props.children}
      </>
    ) : (
      props.icon || props.children
    );

  return (
    <button
      class={className()}
      onClick={props.onClick}
      disabled={props.disabled}
      style={props.style}
    >
      {children}
    </button>
  );
};

export default Button;
