import { Component } from "solid-js";
import Button from "./button";
import Group from "./group";
import { FloatButtonProps } from "./interface";

interface FloatButtonType extends Component<FloatButtonProps> {
  Group: typeof Group;
}

const FloatButton = Button as FloatButtonType;

FloatButton.Group = Group;

export default FloatButton;
