import { JSXElement } from "solid-js";
import { addClassNames } from "../utils";
import "./index.scss";

interface SwitchProps {
  class?: string;
  checked?: boolean;
  setChecked: () => void;
  disabled?: boolean;
  checkedChild?: JSXElement;
  uncheckedChild?: JSXElement;
}

const baseClassName = "switch";

const Switch = (props: SwitchProps) => {
  const classNames = () =>
    addClassNames(
      baseClassName,
      props.class,
      props.checked ? `${baseClassName}-checked` : undefined,
      props.disabled ? "${baseClassName}-disabled" : undefined,
    );

  const onClick = () => {
    if (props.disabled) return;

    props.setChecked();
  };

  return (
    <div class={classNames()} onClick={onClick}>
      <div class={`${baseClassName}-checkbox`}>
        <div class={`${baseClassName}-inner`}>
          {props.checked ? props.checkedChild : props.uncheckedChild}
        </div>
      </div>
    </div>
  );
};

export default Switch;
