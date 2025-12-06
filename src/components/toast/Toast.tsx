import { createEffect, onCleanup, For, type JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { createStore } from "solid-js/store";

import { LazyButton } from "~/lazy";

import * as styles from "./Toast.css";

// Types
export type ToastType = "success" | "error" | "warning" | "info" | "default";
export type ToastPosition =
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
  | "right-end"
  | "center";

export interface ToastOptions {
  id?: string;
  title?: string;
  message: string | JSX.Element;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  icon?: JSX.Element;
  onClose?: () => void;
}

interface ToastItem extends ToastOptions {
  id: string;
  visible: boolean;
  createdAt: number;
}

// Icons
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <title>Close</title>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <title>Info</title>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <title>Check</title>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <title>Alert</title>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <title>Alert</title>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// Store
const [toasts, setToasts] = createStore<ToastItem[]>([]);

let toastIdCounter = 0;
const generateId = () => `toast-${Date.now()}-${toastIdCounter++}`;

// API
const addToast = (options: ToastOptions) => {
  const id = options.id || generateId();
  const newToast: ToastItem = {
    ...options,
    id,
    visible: false, // Start invisible for animation
    createdAt: Date.now(),
    position: options.position || "top",
    type: options.type || "default",
    duration: options.duration ?? 4000, // Default 4s
  };

  setToasts((prev) => [...prev, newToast]);

  // Trigger animation in next frame
  setTimeout(() => {
    setToasts((t) => t.id === id, "visible", true);
  }, 10);

  return id;
};

const removeToast = (id: string) => {
  setToasts((t) => t.id === id, "visible", false);

  // Wait for animation to finish before removing from DOM
  setTimeout(() => {
    const t = toasts.find((item) => item.id === id);
    if (t?.onClose) t.onClose();
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, 300);
};

export const toast = {
  show: (
    message: string | JSX.Element,
    options?: Omit<ToastOptions, "message">,
  ) => addToast({ message, ...options }),
  success: (
    message: string | JSX.Element,
    options?: Omit<ToastOptions, "message" | "type">,
  ) => addToast({ message, type: "success", ...options }),
  error: (
    message: string | JSX.Element,
    options?: Omit<ToastOptions, "message" | "type">,
  ) => addToast({ message, type: "error", ...options }),
  warning: (
    message: string | JSX.Element,
    options?: Omit<ToastOptions, "message" | "type">,
  ) => addToast({ message, type: "warning", ...options }),
  info: (
    message: string | JSX.Element,
    options?: Omit<ToastOptions, "message" | "type">,
  ) => addToast({ message, type: "info", ...options }),
  remove: removeToast,
};

// Individual Toast Component
const ToastItemComponent = (props: { item: ToastItem }) => {
  const { item } = props;
  let timer: number;

  const startTimer = () => {
    if (item.duration && item.duration > 0) {
      timer = window.setTimeout(() => {
        removeToast(item.id);
      }, item.duration);
    }
  };

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
  };

  createEffect(() => {
    startTimer();
    onCleanup(() => clearTimer());
  });

  const getIcon = () => {
    if (item.icon) return item.icon;
    switch (item.type) {
      case "success":
        return <CheckIcon />;
      case "error":
        return <AlertCircleIcon />;
      case "warning":
        return <AlertTriangleIcon />;
      case "info":
        return <InfoIcon />;
      default:
        return null;
    }
  };

  return (
    <div
      class={`${styles.toastBase} ${styles.toastType[item.type ?? "default"]} ${
        styles.toastVisible[String(item.visible) as "true" | "false"]
      }`}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      role="alert"
    >
      <div class={styles.typeIcon[item.type ?? "default"]}>{getIcon()}</div>
      <div class={styles.content}>
        {item.title && (
          <div style={{ "font-weight": "bold", "margin-bottom": "4px" }}>
            {item.title}
          </div>
        )}
        <div>{item.message}</div>
      </div>
      <LazyButton
        onClick={() => removeToast(item.id)}
        icon={<CloseIcon />}
        variant="ghost"
        shape="circle"
        aria-label="Close"
      />
    </div>
  );
};

// Toaster Container
const POSITIONS: ToastPosition[] = [
  "center",
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
];

export const Toaster = () => {
  return (
    <Portal>
      <For each={POSITIONS}>
        {(pos) => {
          const items = () =>
            toasts.filter((t) => (t.position || "top") === pos);
          return (
            <Show when={items().length > 0}>
              <div class={styles.positionWrapper[pos]}>
                <For each={items()}>
                  {(item) => <ToastItemComponent item={item} />}
                </For>
              </div>
            </Show>
          );
        }}
      </For>
    </Portal>
  );
};
