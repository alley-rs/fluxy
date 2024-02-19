import { children, createSignal, type JSXElement } from "solid-js";
import { addClassNames } from "../utils/class";
import "./index.scss";
import { JSX } from "solid-js/h/jsx-runtime";

export type TooltipPlacement = "top" | "left";
// | "right"
// | "bottom"
// | "top-left"
// | "top-right"
// | "bottom-left"
// | "bottom-right"
// | "left-top"
// | "left-bottom"
// | "right-top"
// | "right-bottom";

interface TooltipProps {
  class?: string;
  children: JSXElement;
  text: string;
  placement?: TooltipPlacement;
}

const classPrefix = "tooltip";
const gap = 4;

const Tooltip = (props: TooltipProps) => {
  let tooltipRef: HTMLDivElement | undefined;

  const [isVisible, setIsVisible] = createSignal(false);

  const [positionStyles, setPositionStyles] = createSignal<JSX.CSSProperties>();

  const resolved = children(() => props.children);

  const setPostion = (
    placement: TooltipPlacement,
    childRect: DOMRect,
    tooltipRect: DOMRect,
  ): JSX.CSSProperties => {
    switch (placement) {
      case "top":
        const left = childRect.width / 2 + childRect.left;
        const halfWidth = tooltipRect.width / 2;

        return {
          "--top": `${childRect.top - gap}px`,
          "--left": `${left < halfWidth ? halfWidth : left}px`,
        };

      case "left":
        return {
          "--left": `${childRect.left - tooltipRect.width - 5 - gap}px`,
          "--top": `${childRect.top + childRect.height / 2}px`,
        };
    }
  };

  const className = () => addClassNames(classPrefix, props.class);

  const popoverClassName = () =>
    addClassNames(
      `${classPrefix}-popover`,
      `${classPrefix}-popover-${props.placement ?? "left"}`,
    );

  const arrowClassName = () =>
    addClassNames(
      `${classPrefix}-popover-arrow`,
      `${classPrefix}-popover-arrow-${props.placement ?? "left"}`,
    );

  const updatePostion = () => {
    // TODO: 下面的状态处理不是最佳方式，有待改进
    const child = resolved() as HTMLElement;

    if (!child) return;

    const childRect = child.getBoundingClientRect();

    const tooltipRect = tooltipRef?.getBoundingClientRect();

    if (!childRect || !tooltipRect) return;

    const positionStyle = setPostion(
      props.placement ?? "left",
      childRect,
      tooltipRect,
    );

    setPositionStyles(positionStyle);
  };

  const showTooltip = () => {
    updatePostion();

    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const visibleStyle = () => ({
    "--visibility": isVisible() ? "visible" : "hidden",
  });

  return (
    <div class={className()} style={visibleStyle()}>
      <div
        style={{ display: "inline" }}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {resolved()}
      </div>
      <div ref={tooltipRef} class={popoverClassName()} style={positionStyles()}>
        <div class={arrowClassName()} />
        <div class={`${classPrefix}-text`}>{props.text}</div>
      </div>
    </div>
  );
};

export default Tooltip;
