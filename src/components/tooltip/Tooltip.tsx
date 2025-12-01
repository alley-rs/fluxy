import {
  createSignal,
  onCleanup,
  type JSX,
  mergeProps,
  Show,
  onMount,
  createMemo,
} from "solid-js";
import { Portal } from "solid-js/web";

import { calculateOffsets } from "./TooltipPositioning";

import * as styles from "./Tooltip.css";

export type TooltipPosition =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export interface TooltipProps {
  content: JSX.Element;
  children: JSX.Element;
  position?: TooltipPosition;
  showDelay?: number;
  hideDelay?: number;
  showArrow?: boolean;
}

export const Tooltip = (rawProps: TooltipProps) => {
  const props = mergeProps(
    { position: "top", showDelay: 200, hideDelay: 200, showArrow: true },
    rawProps,
  );

  const [isVisible, setIsVisible] = createSignal(false);
  const [currentPosition, setCurrentPosition] = createSignal<TooltipPosition>(
    props.position as TooltipPosition,
  );
  const [tooltipOffset, setTooltipOffset] = createSignal({ top: 0, left: 0 });
  const [arrowOffset, setArrowOffset] = createSignal<{
    top?: number;
    left?: number;
    right?: number;
  }>({});

  let containerRef: HTMLDivElement | undefined;
  let tooltipRef: HTMLDivElement | undefined;
  let showTimeout: number | undefined;
  let hideTimeout: number | undefined;

  // Clear timeouts
  const clearTimeouts = () => {
    if (showTimeout) window.clearTimeout(showTimeout);
    if (hideTimeout) window.clearTimeout(hideTimeout);
  };

  // Calculate position using the positioning algorithm
  const updatePosition = () => {
    if (!containerRef || !tooltipRef) return;

    // Get the trigger element (handle display: contents)
    let triggerElement: HTMLElement = containerRef;
    if (
      containerRef.getBoundingClientRect().width === 0 &&
      containerRef.getBoundingClientRect().height === 0 &&
      containerRef.firstElementChild instanceof HTMLElement
    ) {
      triggerElement = containerRef.firstElementChild;
    }

    // 隐藏时缩放为0.95，需根据实际宽度和高度计算偏移量
    const tooltipSize = {
      width: tooltipRef.getBoundingClientRect().width / 0.95,
      height: tooltipRef.getBoundingClientRect().height / 0.95,
    };

    const result = calculateOffsets(
      triggerElement.getBoundingClientRect(),
      tooltipSize,
      props.position as TooltipPosition,
    );

    setCurrentPosition(result.finalPositioning);
    setTooltipOffset(result.tooltip);
    setArrowOffset(result.arrow);
  };

  const show = () => {
    clearTimeouts();
    showTimeout = window.setTimeout(() => {
      setIsVisible(true);
      // Wait for render to check position?
      // With Portal, the element might be inserted into DOM.
      // We need to make sure it's layout-ready.
      requestAnimationFrame(() => {
        updatePosition();
      });
    }, props.showDelay);
  };

  const hide = () => {
    clearTimeouts();
    hideTimeout = window.setTimeout(() => {
      setIsVisible(false);
    }, props.hideDelay);
  };

  const handleMouseEnter = () => {
    show();
  };

  const handleMouseLeave = () => {
    hide();
  };

  const handleClick = (_: MouseEvent) => {
    if (isVisible()) {
      hide();
    } else {
      show();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    // Check if click is outside container AND outside tooltip
    const target = e.target as Node;
    const isInsideContainer = containerRef?.contains(target);
    const isInsideTooltip = tooltipRef?.contains(target);

    if (isVisible() && !isInsideContainer && !isInsideTooltip) {
      hide();
    }
  };

  // Update position on scroll or resize
  const handleScrollOrResize = () => {
    if (isVisible()) {
      updatePosition();
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);
  });

  onCleanup(() => {
    clearTimeouts();
    document.removeEventListener("click", handleClickOutside);
    window.removeEventListener("resize", handleScrollOrResize);
    window.removeEventListener("scroll", handleScrollOrResize, true);
  });

  const arrowStyle = createMemo(() => {
    const { left, right, top } = arrowOffset();
    if (left !== undefined) return { left: `${left}px` };
    if (right !== undefined) return { right: `${right}px` };
    if (top !== undefined) return { top: `${top}px` };
  });

  return (
    <>
      <div
        ref={containerRef}
        class={styles.container}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {props.children}
      </div>

      <Portal>
        <div
          ref={tooltipRef}
          class={`${styles.tooltipContent} ${
            isVisible() ? styles.tooltipVisible : styles.tooltipHidden
          }`}
          data-tooltip-position={currentPosition()}
          style={{
            top: `${tooltipOffset().top}px`,
            left: `${tooltipOffset().left}px`,
          }}
        >
          {props.content}
          <Show when={props.showArrow}>
            <div class={styles.arrow} style={arrowStyle()} />
          </Show>
        </div>
      </Portal>
    </>
  );
};
