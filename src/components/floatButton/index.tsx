import { For, type JSXElement } from "solid-js";
import Button from "../button";
import Tooltip from "../tooltip";
import "./index.scss";
import { classNames } from "../utils/class";
import { TbHome } from "solid-icons/tb";

interface FloatButtonProps {
  class?: string;
  onClick: () => void;
  icon?: JSXElement;
  tooltip?: string;
  right?: number;
  bottom?: number;
}

const FloatButton = (props: FloatButtonProps) => {
  const className = classNames("float-button", props.class);

  const button = (
    <Button
      icon={props.icon ?? <TbHome />}
      onClick={props.onClick}
      shape="circle"
    />
  );

  return (
    <div
      class={className}
      style={{
        "--right": `${props.right ?? 20}px`,
        "--bottom": `${props.bottom ?? 20}px`,
      }}
    >
      {props.tooltip ? (
        <Tooltip text={props.tooltip}>{button}</Tooltip>
      ) : (
        button
      )}
    </div>
  );
};

interface FloatGroupProps {
  options: FloatButtonProps[];
  right?: number;
  bottom?: number;
}

const FloatGroup = (props: FloatGroupProps) => {
  return (
    <div
      class="float-button-group"
      style={{
        "--right": `${props.right ?? 20}px`,
        "--bottom": `${props.bottom ?? 20}px`,
      }}
    >
      <For each={props.options}>
        {(option) => <FloatButton {...option} class="group-item" />}
      </For>
    </div>
  );
};

FloatButton.Group = FloatGroup;

export default FloatButton;
