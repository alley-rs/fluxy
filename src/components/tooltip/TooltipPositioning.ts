import type { TooltipPosition } from "./Tooltip";

const CONSTANTS = {
  ARROW_OFFSET: 4.242,
  TOOLTIP_OFFSET: 8,
  HORIZONTAL_OFFSET: 4, // 阴影的水平偏移
  VERTICAL_OFFSET: 2, // 阴影的垂直偏移
  HIDDEN_POSITION: -9999,
  VIEWPORT_PADDING: 10, // Minimum padding from viewport edges
} as const;

export interface Offset {
  top: number;
  left: number;
}

export interface OffsetNullable {
  top?: number;
  left?: number;
  right?: number;
}

// Define opposite positions for flipping
const POSITION_MIRRORS: Record<TooltipPosition, TooltipPosition> = {
  top: "bottom",
  "top-start": "bottom-start",
  "top-end": "bottom-end",
  bottom: "top",
  "bottom-start": "top-start",
  "bottom-end": "top-end",
  left: "right",
  "left-start": "right-start",
  "left-end": "right-end",
  right: "left",
  "right-start": "left-start",
  "right-end": "left-end",
};

const calculateCenter = {
  vertical: (trigger: DOMRect, tooltipSize: Pick<DOMRect, "height">): number =>
    trigger.top + (trigger.height - tooltipSize.height) / 2,

  horizontal: (trigger: DOMRect, tooltipSize: Pick<DOMRect, "width">): number =>
    trigger.left + (trigger.width - tooltipSize.width) / 2,

  arrowVertical: (tooltipHeight: number): number =>
    // Absolute positioning relative to the content area of the parent element.
    // The tooltip has a 1px border, so 1 should be subtracted when calculating the arrow position.
    tooltipHeight / 2 - 1 - CONSTANTS.ARROW_OFFSET,

  arrowHorizontal: (tooltipWidth: number): number =>
    // Absolute positioning relative to the content area of the parent element.
    // The tooltip has a 1px border, so 1 should be subtracted when calculating the arrow position.
    tooltipWidth / 2 - 1 - CONSTANTS.ARROW_OFFSET,
};

const calculateArrowOffset = (
  triggerRect: DOMRect,
  tooltipSize: Pick<DOMRect, "width" | "height">,
  positioning: TooltipPosition,
): OffsetNullable => {
  const verticalCenter = calculateCenter.arrowVertical(tooltipSize.height);
  const horizontalCenter = calculateCenter.arrowHorizontal(tooltipSize.width);
  const triggerMidPoint = triggerRect.width / 2 - CONSTANTS.ARROW_OFFSET;

  const positionMap: Record<TooltipPosition, OffsetNullable> = {
    top: { left: horizontalCenter },
    "top-start": { left: triggerMidPoint },
    "top-end": { right: triggerMidPoint },
    bottom: { left: horizontalCenter },
    "bottom-start": { left: triggerMidPoint },
    "bottom-end": { right: triggerMidPoint },
    left: { top: verticalCenter },
    "left-start": { top: verticalCenter },
    "left-end": { top: verticalCenter },
    right: { top: verticalCenter },
    "right-start": { top: verticalCenter },
    "right-end": { top: verticalCenter },
  };

  return positionMap[positioning];
};

const calculateTooltipOffset = (
  triggerRect: DOMRect,
  tooltipSize: Pick<DOMRect, "width" | "height">,
  positioning: TooltipPosition,
): Offset => {
  const verticalCenter = calculateCenter.vertical(triggerRect, tooltipSize);
  const horizontalCenter = calculateCenter.horizontal(triggerRect, tooltipSize);

  const positionMap: Record<TooltipPosition, Offset> = {
    top: {
      top:
        triggerRect.top -
        tooltipSize.height -
        CONSTANTS.TOOLTIP_OFFSET -
        CONSTANTS.VERTICAL_OFFSET,
      left: horizontalCenter,
    },
    "top-start": {
      top:
        triggerRect.top -
        tooltipSize.height -
        CONSTANTS.TOOLTIP_OFFSET -
        CONSTANTS.VERTICAL_OFFSET,
      left: triggerRect.left,
    },
    "top-end": {
      top:
        triggerRect.top -
        tooltipSize.height -
        CONSTANTS.TOOLTIP_OFFSET -
        CONSTANTS.VERTICAL_OFFSET,
      left: triggerRect.right - tooltipSize.width,
    },
    bottom: {
      top:
        triggerRect.bottom +
        CONSTANTS.TOOLTIP_OFFSET +
        CONSTANTS.VERTICAL_OFFSET,
      left: horizontalCenter,
    },
    "bottom-start": {
      top:
        triggerRect.bottom +
        CONSTANTS.TOOLTIP_OFFSET +
        CONSTANTS.VERTICAL_OFFSET,
      left: triggerRect.left,
    },
    "bottom-end": {
      top:
        triggerRect.bottom +
        CONSTANTS.TOOLTIP_OFFSET +
        CONSTANTS.VERTICAL_OFFSET,
      left: triggerRect.right - tooltipSize.width,
    },
    left: {
      top: verticalCenter,
      left:
        triggerRect.left -
        tooltipSize.width -
        CONSTANTS.TOOLTIP_OFFSET -
        CONSTANTS.HORIZONTAL_OFFSET,
    },
    "left-start": {
      top: triggerRect.top,
      left:
        triggerRect.left -
        tooltipSize.width -
        CONSTANTS.TOOLTIP_OFFSET -
        CONSTANTS.HORIZONTAL_OFFSET,
    },
    "left-end": {
      top: triggerRect.bottom - tooltipSize.height,
      left:
        triggerRect.left -
        tooltipSize.width -
        CONSTANTS.TOOLTIP_OFFSET -
        CONSTANTS.HORIZONTAL_OFFSET,
    },
    right: {
      top: verticalCenter,
      left:
        triggerRect.right +
        CONSTANTS.TOOLTIP_OFFSET +
        CONSTANTS.HORIZONTAL_OFFSET,
    },
    "right-start": {
      top: triggerRect.top,
      left:
        triggerRect.right +
        CONSTANTS.TOOLTIP_OFFSET +
        CONSTANTS.HORIZONTAL_OFFSET,
    },
    "right-end": {
      top: triggerRect.bottom - tooltipSize.height,
      left:
        triggerRect.right +
        CONSTANTS.TOOLTIP_OFFSET +
        CONSTANTS.HORIZONTAL_OFFSET,
    },
  };

  return positionMap[positioning];
};

// Check if the tooltip fits within the viewport with the current positioning
const doesTooltipFitViewport = (
  tooltipSize: Pick<DOMRect, "width" | "height">,
  offset: Offset,
  positioning: TooltipPosition,
): boolean => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const tooltipTop = offset.top;
  const tooltipLeft = offset.left;
  const tooltipRight = tooltipLeft + tooltipSize.width;
  const tooltipBottom = tooltipTop + tooltipSize.height;

  // Add padding to viewport edges
  const minDistance = CONSTANTS.VIEWPORT_PADDING;

  // Check if tooltip exceeds viewport boundaries
  const fitsVertically =
    tooltipTop >= minDistance && tooltipBottom <= viewportHeight - minDistance;
  const fitsHorizontally =
    tooltipLeft >= minDistance && tooltipRight <= viewportWidth - minDistance;

  // For vertical positions (top/bottom), primarily check vertical fit
  if (positioning.startsWith("top") || positioning.startsWith("bottom")) {
    return fitsVertically;
  }

  // For horizontal positions (left/right), primarily check horizontal fit
  if (positioning.startsWith("left") || positioning.startsWith("right")) {
    return fitsHorizontally;
  }

  return fitsVertically && fitsHorizontally;
};

// Main function to calculate the position of the tooltip and its arrow
export const calculateOffsets = (
  triggerRect: DOMRect,
  tooltipSize: Pick<DOMRect, "width" | "height">,
  positioning: TooltipPosition,
): {
  tooltip: Offset;
  arrow: OffsetNullable;
  finalPositioning: TooltipPosition;
} => {
  // Calculate initial position
  let finalPositioning = positioning;
  let tooltipOffset = calculateTooltipOffset(
    triggerRect,
    tooltipSize,
    positioning,
  );

  // Check if tooltip fits in the current position
  if (!doesTooltipFitViewport(tooltipSize, tooltipOffset, positioning)) {
    // Try the mirror position
    const mirrorPosition = POSITION_MIRRORS[positioning];
    const mirrorOffset = calculateTooltipOffset(
      triggerRect,
      tooltipSize,
      mirrorPosition,
    );

    // Use mirror position if it fits better
    if (doesTooltipFitViewport(tooltipSize, mirrorOffset, mirrorPosition)) {
      finalPositioning = mirrorPosition;
      tooltipOffset = mirrorOffset;
    }
  }

  const arrow = calculateArrowOffset(
    triggerRect,
    tooltipSize,
    finalPositioning,
  );

  return {
    tooltip: tooltipOffset,
    arrow,
    finalPositioning,
  };
};
