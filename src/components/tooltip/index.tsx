import {
  children,
  createSignal,
  type JSXElement,
  createEffect,
} from "solid-js";
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
  let childRef: HTMLDivElement | undefined,
    tooltipRef: HTMLDivElement | undefined;
  const [isVisible, setIsVisible] = createSignal(false);

  const [positionStyles, setPositionStyles] = createSignal<JSX.CSSProperties>();

  const resolved = children(() => props.children);

  // TODO: 下面的状态处理不是最佳方式，有待改进
  createEffect(() => {
    // children 懒加载无法使用 onMount 监听，需要直接判断 props.children 的变化
    const child = resolved() as HTMLElement;

    if (!child) return;

    const tooltipRect = tooltipRef?.getBoundingClientRect();
    const childRect = childRef?.getBoundingClientRect();

    if (!childRect || !tooltipRect) return;

    const positionStyle = setPostion(
      props.placement ?? "left",
      childRect,
      tooltipRect,
    );

    console.log(childRect);

    setPositionStyles({
      ...positionStyle,
      // "--visibility": isVisible() ? "visible" : "hidden",
    });
  });

  const setPostion = (
    placement: TooltipPlacement,
    childRect: DOMRect,
    tooltipRect: DOMRect,
  ): JSX.CSSProperties => {
    switch (placement) {
      case "top":
        return {
          "--top": `${childRect.top - gap}px`,
          "--left": `${childRect.width / 2 + childRect.left}px`,
        };
      case "left":
        return {
          "--left": `${childRect.left - tooltipRect.width - 5 - gap}px`,
          "--top": `${childRect.top + childRect.width / 2}px`,
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

  const showTooltip = () => {
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
        ref={childRef}
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
