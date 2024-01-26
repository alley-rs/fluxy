import { createSignal, For, type JSXElement } from "solid-js";
import "./index.scss";
import { addClassNames } from "../utils/class";

interface DropdownProps {
  class?: string;
  open?: boolean;
  onOpenChange?: () => void;
  children: JSXElement;
  menu: MenuItemProps[];
}

const baseClassName = "dropdown";

const Dropdown = (props: DropdownProps) => {
  const [isOpen, setOpen] = createSignal(true);
  // const [isOpen, setOpen] = createSignal(props.open);

  const className = () => addClassNames(baseClassName, props.class || "");

  const handleMouseEnter = () => {
    setOpen(true);
    // props.onOpenChange?.();
  };

  const handleMouseLeave = () => {
    setOpen(false);
    // props.onOpenChange?.();
  };

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div
          class={className()}
          style={{ display: isOpen() ? "block" : "none" }}
        >
          <div class={`${baseClassName}-menu`}>
            {isOpen() && (
              <For each={props.menu}>{(item) => <MenuItem {...item} />}</For>
            )}
          </div>
        </div>
        {props.children}
      </div>
    </>
  );
};

export interface MenuItemProps {
  label: string;
  onClick: () => void;
}

const MenuItem = (props: MenuItemProps) => {
  return (
    <li class={`${baseClassName}-menu-item`}>
      <span class={`${baseClassName}-menu-title-content`}>
        <a onClick={props.onClick}>{props.label}</a>
      </span>
    </li>
  );
};

export default Dropdown;
