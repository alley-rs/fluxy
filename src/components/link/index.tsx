import type { JSXElement } from "solid-js";
import "./index.scss";

const baseClassName = "link";

interface TraditionalLinkProps {
  href: string;
}

interface ButtonLinkProps {
  onClick: () => void;
}

interface BaseLinkProps {
  class?: string;
  children: JSXElement;
}

type LinkProps =
  | (BaseLinkProps & TraditionalLinkProps)
  | (BaseLinkProps & ButtonLinkProps);

const Link = (props: LinkProps) => {
  return (
    <a
      class={props.class ? `${baseClassName} ${props.class}` : baseClassName}
      href={"href" in props ? props.href : undefined}
      onClick={"onClick" in props ? props.onClick : undefined}
    >
      {props.children}
    </a>
  );
};

export default Link;
