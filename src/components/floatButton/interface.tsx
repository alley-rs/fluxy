import type { JSXElement } from "solid-js";

export interface FloatButtonProps {
  class?: string;
  onClick: () => void;
  icon?: JSXElement;
  tooltip?: string;
  right?: number;
  bottom?: number;
}

export interface FloatGroupProps {
  options: FloatButtonProps[];
  right?: number;
  bottom?: number;
}
