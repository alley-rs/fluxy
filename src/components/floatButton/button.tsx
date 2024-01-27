import Button from "../button";
import Tooltip from "../tooltip";
import "./index.scss";
import { classNames } from "../utils/class";
import { TbHome } from "solid-icons/tb";
import { FloatButtonProps } from "./interface";

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

export default FloatButton;
