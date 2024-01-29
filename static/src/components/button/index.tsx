import type { JSXElement } from "solid-js";
import { addClassNames } from "../utils";
import "./index.scss";

interface ButtonProps {
  class?: string;
  children?: JSXElement;
  block?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const baseClassName = "button";

const Button = (props: ButtonProps) => {
  const classNames = () =>
    addClassNames(
      baseClassName,
      props.class,
      props.disabled ? `${baseClassName}-disabled` : undefined,
    );

  return (
    <button
      class={classNames()}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
