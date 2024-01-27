import { createSignal, type JSXElement } from "solid-js";
import { classNames } from "../utils/class";
import "./index.scss";

export type TooltipPlacement =
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";

interface TooltipProps {
  class?: string;
  children: JSXElement;
  text: string;
}

const classPrefix = "tooltip";

const Tooltip = (props: TooltipProps) => {
  const [isVisible, setIsVisible] = createSignal(false);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <div
      class={classNames(classPrefix, props.class)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {props.children}
      {isVisible() && (
        <div class={`${classPrefix}-popover`}>
          <div class={`${classPrefix}-popover-arrow`} />
          <div class={`${classPrefix}-text`}>{props.text}</div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
