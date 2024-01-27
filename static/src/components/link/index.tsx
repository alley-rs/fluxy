import type { JSXElement } from "solid-js";
import "./index.scss";

interface HrefLinkProps {
  href: string;
  download?: string;
}

interface ButtonLinkProps {
  onClick: () => void;
}

interface BaseLinkProps {
  class?: string;
  children: JSXElement;
}

type LinkProps =
  | (BaseLinkProps & HrefLinkProps)
  | (BaseLinkProps & ButtonLinkProps);

const baseClassName = "link";

const Link = (props: LinkProps) => {
  return (
    <a
      class={props.class ? `${baseClassName} ${props.class}` : baseClassName}
      href={"href" in props ? props.href : undefined}
      download={"download" in props ? props.download : undefined}
      onClick={"onClick" in props ? props.onClick : undefined}
    >
      {props.children}
    </a>
  );
};

export default Link;
