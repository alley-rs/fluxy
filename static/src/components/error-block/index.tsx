import "./index.scss";
import EmptyIcon from "./icons/empty";
import type { JSXElement } from "solid-js";
import { addClassNames } from "../utils";

interface ErrorBlockProps {
  class?: string;
  description?: string;
  fullPage?: boolean;
  title?: string;
  status: "empty";
}

const baseClassName = "error-block";

const ErrorBlock = (props: ErrorBlockProps) => {
  const classNames = () => addClassNames(baseClassName, props.class);

  const icons: Record<ErrorBlockProps["status"], JSXElement> = {
    empty: <EmptyIcon />,
  };

  return (
    <div class={classNames()}>
      <div class={`${baseClassName}-image`}>{icons[props.status]}</div>
      <div class={`${baseClassName}-description`}>
        <div class={`${baseClassName}-description-title`}>{props.title}</div>
        <div class={`${baseClassName}-description-subtitle`}>
          {props.description}
        </div>
      </div>
    </div>
  );
};

export default ErrorBlock;
