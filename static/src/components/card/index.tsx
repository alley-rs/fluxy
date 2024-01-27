import type { JSXElement } from "solid-js";
import { addClassNames } from "../utils";
import Divider from "../divider";

interface CardProps {
  class?: string;
  style?: CSSProperties;
  title: JSXElement;
  description?: JSXElement;
  actions: JSXElement;
}

const baseClassName = "card";

const Card = (props: CardProps) => {
  const classNames = () => addClassNames(baseClassName, props.class);

  return (
    <div class={classNames()} style={props.style}>
      <div class={`${baseClassName}-title`}>{props.title}</div>
      <Divider />
      <div class={`${baseClassName}-description`}>{props.description}</div>
      <div class={`${baseClassName}-actions`}>{props.actions}</div>
    </div>
  );
};

export default Card;
