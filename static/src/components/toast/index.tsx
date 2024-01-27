import { createSignal, onCleanup, createEffect } from "solid-js";

interface ToastProps {
  duration?: number;
  message: string;
}

const Toast = (props: ToastProps) => {
  const [visible, setVisible] = createSignal(true);

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
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "10px",
        background: "#333",
        color: "#fff",
        "border-radius": "5px",
        display: visible() ? "block" : "none",
      }}
    >
      {props.message}
    </div>
  );
};

export default Toast;
