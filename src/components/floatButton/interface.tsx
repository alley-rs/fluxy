import type { ButtonProps } from "../button";

export interface FloatButtonProps extends ButtonProps {
  tooltip?: string;
  right?: number;
  bottom?: number;
}

export interface FloatGroupProps {
  options: FloatButtonProps[];
  right?: number;
  bottom?: number;
}
