import { Show, type JSXElement } from "solid-js";
import "./index.scss";
import Row from "../row";
import Col from "../col";

interface CardProps {
  class?: string;
  title: JSXElement;
  icon?: JSXElement;
  onHeaderClick?: () => void;
  children: JSXElement;
}

const baseClassName = "card";

const Card = (props: CardProps) => {
  return (
    <div
      class={props.class ? `${baseClassName} ${props.class}` : baseClassName}
    >
      <Show when={props.icon} fallback={props.title}>
        <Row class={`${baseClassName}__title`}>
          <Col span={22}>{props.title}</Col>
          <Col span={2}>{props.icon}</Col>
        </Row>
      </Show>

      {props.children}
    </div>
  );
};

export default Card;
