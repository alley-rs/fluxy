import { Show, type JSXElement } from "solid-js";
import { addClassNames } from "../utils";
import "./index.scss";

interface ListItemProps {
  class?: string;
  avatar?: JSXElement;
  title: JSXElement;
  description?: JSXElement;
  extra: JSXElement;
  foot?: JSXElement;
}

const ListItem = (props: ListItemProps) => {
  const classPrefix = "list-item";
  const classNames = () => addClassNames(classPrefix, props.class);

  return (
    <li class={classNames()}>
      <div class={`${classPrefix}__content`}>
        <Show when={props.avatar}>
          <div class={`${classPrefix}__content-avatar`}>{props.avatar}</div>
        </Show>

        <div class={`${classPrefix}__content-texts`}>
          <div class={`${classPrefix}__content-title`}>{props.title}</div>
          <div class={`${classPrefix}__content-description`}>
            {props.description}
          </div>
        </div>

        <div class={`${classPrefix}__content-extra`}>
          {props.extra ? props.extra : null}
        </div>
      </div>

      <Show when={props.foot}>
        <div class={`${classPrefix}__foot`}>{props.foot}</div>
      </Show>
    </li>
  );
};

export default ListItem;
