import { createSignal, onCleanup, createEffect } from "solid-js";
import { addClassNames } from "../utils";
import "./index.scss";

interface ToastProps {
  class?: string;
  duration?: number;
  message: string;
}

const baseClassName = "toast";

const Toast = (props: ToastProps) => {
  const [visible, setVisible] = createSignal(true);

  const classNames = () => addClassNames(baseClassName, props.class);

  createEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, props.duration || 1000); // 默认 1 秒

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });

  return (
    <div
      class={classNames()}
      style={{
        display: visible() ? "block" : "none",
      }}
    >
      {props.message}
    </div>
  );
};

export default Toast;
