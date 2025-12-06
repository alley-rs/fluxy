import {
  type Component,
  type JSX,
  createSignal,
  createEffect,
  onCleanup,
  children,
  mergeProps,
  splitProps,
  Show,
  createMemo,
  lazy,
} from "solid-js";
import { Portal } from "solid-js/web";
import * as styles from "./Dialog.css";

// 懒加载所需组件
const Divider = lazy(() => import("~/components/divider"));
const Text = lazy(() => import("~/components/text"));

interface DialogProps {
  /** 是否显示对话框 */
  open: boolean;
  /** 关闭对话框时的回调 */
  onOpenChange?: (open: boolean) => void;
  /** 对话框标题 */
  title?: string;
  /** 对话框尺寸 */
  size?: "sm" | "md" | "lg";
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
  /** 点击遮罩层是否关闭对话框 */
  closeOnOverlayClick?: boolean;
  /** 标题是否居中 */
  titleCentered?: boolean;
  /** 是否显示头部和底部的分隔线 */
  showDivider?: boolean;
  /** 是否全屏显示 */
  fullscreen?: boolean;
  /** 子元素 */
  children?: JSX.Element;
  /** 底部内容 */
  footer?: JSX.Element;
}

export const Dialog: Component<DialogProps> = (props) => {
  const merged = mergeProps(
    {
      size: "md",
      showCloseButton: false, // 默认不显示关闭按钮
      closeOnOverlayClick: true,
      titleCentered: false,
      showDivider: false,
      fullscreen: false,
    } as const,
    props
  );

  const [local, others] = splitProps(merged, [
    "open",
    "onOpenChange",
    "title",
    "size",
    "showCloseButton",
    "closeOnOverlayClick",
    "titleCentered",
    "showDivider",
    "fullscreen",
    "children",
    "footer",
  ]);

  const [isVisible, setIsVisible] = createSignal(false);
  const [entering, setEntering] = createSignal(false);

  const showCloseButton = createMemo(
    () =>
      local.showCloseButton || !local.closeOnOverlayClick || local.fullscreen
  );

  // 控制可见性和动画状态
  createEffect(() => {
    if (local.open) {
      setIsVisible(true);
      // 延迟设置 entering 状态以触发进入动画
      const timer = setTimeout(() => {
        setEntering(true);
      }, 10);

      onCleanup(() => clearTimeout(timer));
    } else {
      setEntering(false);
      // 延迟隐藏以允许退出动画完成
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // 与 CSS 中的动画持续时间匹配

      onCleanup(() => clearTimeout(timer));
    }
  });

  // 处理 Escape 键关闭
  createEffect(() => {
    if (!local.open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  const handleClose = () => {
    local.onOpenChange?.(false);
  };

  const handleOverlayClick = (e: MouseEvent) => {
    if (local.closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  const resolvedChildren = children(() => local.children);
  const resolvedFooter = children(() => local.footer);

  const classList = () => ({
    [styles.dialog]: true,
    [styles.dialogSizes[local.size]]: !local.fullscreen,
    [styles.fullscreen]: local.fullscreen,
  });

  return (
    <Show when={isVisible()}>
      <Portal>
        <div
          class={styles.overlay}
          data-entering={entering()}
          onClick={handleOverlayClick}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={local.title ? "dialog-title" : undefined}
            classList={classList()}
            data-entering={entering()}
            {...others}
          >
            <div class={styles.header}>
              <Text
                variant="h4"
                classList={{ [styles.titleCentered]: local.titleCentered }}
              >
                {local.title}
              </Text>

              <Show when={showCloseButton()}>
                <div
                  class={local.titleCentered ? styles.closeButtonContainer : ""}
                >
                  <button
                    type="button"
                    class={styles.closeButton}
                    onClick={handleClose}
                    aria-label="关闭对话框"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <title>关闭图标</title>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </Show>
            </div>

            {/* 在头部下方添加 Divider */}
            <Show when={local.showDivider}>
              <Divider orientation="horizontal" size="sm" />
            </Show>

            <div class={styles.content}>{resolvedChildren()}</div>

            <Show when={resolvedFooter()}>
              {/* 在底部上方添加 Divider */}
              <Show when={local.showDivider}>
                <Divider orientation="horizontal" size="sm" />
              </Show>
              <div class={styles.footer}>{resolvedFooter()}</div>
            </Show>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

// 默认导出以支持直接使用
export default Dialog;
