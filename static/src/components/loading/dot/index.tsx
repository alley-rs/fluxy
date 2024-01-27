import { addClassNames } from "~/components/utils";
import "./index.scss";
import DotLoadingIcon from "./icon";

interface DotLoadingProps {
  class?: string;
  color?: "default" | "primary" | "white" | string;
}

const baseClassName = "dot-loading";

const DotLoading = (props: DotLoadingProps) => {
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
      <DotLoadingIcon />
    </div>
  );
};

export default DotLoading;
