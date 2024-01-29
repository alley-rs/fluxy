import { For, Show, type JSXElement } from "solid-js";
import "./index.scss";
import { addClassNames } from "../utils";

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

interface ListProps<T> {
  header?: JSXElement;
  class?: string;
  dataSource: T[];
  renderItem: (item: T, index: number) => JSXElement;
}

const baseClassName = "list";

const List = <T extends object>(props: ListProps<T>) => {
  const classNames = () => addClassNames(baseClassName, props.class);

  return (
    <div class={classNames()}>
      <Show when={props.header}>
        <div class={`${baseClassName}-header`}>{props.header}</div>
      </Show>

      <ul>
        <For each={props.dataSource}>
          {(item, index) => props.renderItem(item, index())}
        </For>
      </ul>
    </div>
  );
};

List.Item = ListItem;

export default List;
