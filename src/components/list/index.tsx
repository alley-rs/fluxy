import { For, type JSXElement } from "solid-js";
import "./index.scss";

interface ListItemProps {
  avatar?: JSXElement;
  title: string;
  description?: JSXElement;
  extra: JSXElement[];
}

const ListItem = (props: ListItemProps) => {
  const classPrefix = "list-item";
  return (
    <li class={classPrefix}>
      <div class={`${classPrefix}__avatar`}>
        {props.avatar ? props.avatar : null}
      </div>

      <div class={`${classPrefix}__texts`}>
        <div class={`${classPrefix}__title`}>{props.title}</div>
        <div class={`${classPrefix}__description`}>{props.description}</div>
      </div>

      <div class={`${classPrefix}__extra`}>
        {props.extra ? props.extra : null}
      </div>
    </li>
  );
};

interface ListProps<T> {
  class?: string;
  dataSource: T[];
  renderItem: (item: T, index: number) => JSXElement;
}

const List = <T extends object>(props: ListProps<T>) => {
  return (
    <ul class="list">
      <For each={props.dataSource}>
        {(item, index) => props.renderItem(item, index())}
      </For>
    </ul>
  );
};

List.Item = ListItem;

export default List;
