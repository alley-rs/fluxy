import { addClassNames } from "~/components/utils";
import "./index.scss";

interface SpinLoadingProps {
  class?: string;
  color?: "default" | "primary" | "white" | string;
}

const baseClassName = "spin-loading";

const SpinLoading = (props: SpinLoadingProps) => {
  const classNames = () => addClassNames(baseClassName, props.class || "");

  const style = (): CSSProperties => ({
    color:
      props.color && props.color !== "default"
        ? props.color === "primary"
          ? "var(--color-primary)"
          : props.color === "white"
            ? "#fff"
            : props.color
        : "var(--color-weak)",
  });

  return (
    <div class={classNames()} style={style()}>
      <span class={`${baseClassName}-dot ${baseClassName}-dot-spin`}>
        <i class={`${baseClassName}-dot-item`}></i>
        <i class={`${baseClassName}-dot-item`}></i>
        <i class={`${baseClassName}-dot-item`}></i>
        <i class={`${baseClassName}-dot-item`}></i>
      </span>
    </div>
  );
};

export default SpinLoading;
