import {
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  Show,
} from "solid-js";
import { LazyTooltip } from "~/lazy";
import * as styles from "./EllipsisText.css";

interface EllipsisTextProps {
  text: string;
  ellipsis?: string;
  position?: "start" | "middle" | "end";
  class?: string;
  showTooltip?: boolean;
}

export const EllipsisText = (props: EllipsisTextProps) => {
  const merged = mergeProps(
    { ellipsis: "...", position: "end", showTooltip: true } as const,
    props
  );

  let containerRef: HTMLSpanElement | undefined;
  let measureRef: HTMLSpanElement | undefined;

  const [displayText, setDisplayText] = createSignal(props.text);
  const [isOverflowing, setIsOverflowing] = createSignal(false);

  const calculateEllipsis = () => {
    if (!containerRef || !measureRef) return;

    const containerWidth = containerRef.offsetWidth;
    const fullText = props.text;

    // 测量完整文本
    measureRef.textContent = fullText;
    const fullWidth = measureRef.offsetWidth;

    // 不溢出，直接显示
    if (fullWidth <= containerWidth) {
      setDisplayText(fullText);
      setIsOverflowing(false);
      return;
    }

    // 溢出了，需要省略
    setIsOverflowing(true);

    // 测量省略符宽度
    measureRef.textContent = merged.ellipsis;
    const ellipsisWidth = measureRef.offsetWidth;
    const availableWidth = containerWidth - ellipsisWidth;

    let result = fullText;

    if (merged.position === "end") {
      result = calculateEndEllipsis(fullText, availableWidth);
    } else if (merged.position === "start") {
      result = calculateStartEllipsis(fullText, availableWidth);
    } else if (merged.position === "middle") {
      result = calculateMiddleEllipsis(fullText, availableWidth);
    }

    setDisplayText(result);
  };

  // 末尾省略
  const calculateEndEllipsis = (fullText: string, availableWidth: number) => {
    if (!measureRef) return fullText + merged.ellipsis;

    let left = 0;
    let right = fullText.length;
    let bestLength = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const testText = fullText.substring(0, mid);

      measureRef.textContent = testText;
      const width = measureRef.offsetWidth;

      if (width <= availableWidth) {
        bestLength = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return fullText.substring(0, bestLength) + merged.ellipsis;
  };

  // 开头省略
  const calculateStartEllipsis = (fullText: string, availableWidth: number) => {
    if (!measureRef) return merged.ellipsis + fullText;

    let left = 0;
    let right = fullText.length;
    let bestLength = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const testText = fullText.substring(fullText.length - mid);

      measureRef.textContent = testText;
      const width = measureRef.offsetWidth;

      if (width <= availableWidth) {
        bestLength = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return merged.ellipsis + fullText.substring(fullText.length - bestLength);
  };

  // 中间省略
  const calculateMiddleEllipsis = (
    fullText: string,
    availableWidth: number
  ) => {
    if (!measureRef) return fullText;

    let left = 0;
    let right = fullText.length;
    let bestLength = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const half = Math.floor(mid / 2);
      const start = fullText.substring(0, half);
      const end = fullText.substring(fullText.length - (mid - half));

      measureRef.textContent = start + end;
      const width = measureRef.offsetWidth;

      if (width <= availableWidth) {
        bestLength = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    const half = Math.floor(bestLength / 2);
    const start = fullText.substring(0, half);
    const end = fullText.substring(fullText.length - (bestLength - half));

    return `${start}${merged.ellipsis}${end}`;
  };

  // 监听文本和配置变化
  createEffect(() => {
    props.text;
    merged.ellipsis;
    merged.position;
    calculateEllipsis();
  });

  // 监听容器大小变化
  createEffect(() => {
    if (!containerRef) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateEllipsis();
    });

    resizeObserver.observe(containerRef);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  const classList = () => ({
    [styles.container]: true,
    [merged.class ?? ""]: !!merged.class,
  });

  return (
    <>
      <Show
        when={isOverflowing()}
        fallback={
          <span ref={containerRef} classList={classList()}>
            {displayText()}
          </span>
        }
      >
        <LazyTooltip content={merged.text} position="bottom-start">
          <span ref={containerRef} classList={classList()}>
            {displayText()}
          </span>
        </LazyTooltip>
      </Show>

      {/* 隐藏的测量元素 */}
      <span ref={measureRef} class={styles.measureElement} aria-hidden="true" />
    </>
  );
};
