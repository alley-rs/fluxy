import type { JSXElement } from "solid-js";
import "./index.scss";
import { addClassNames } from "../utils";

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
  wrap?: boolean;
}

type LinkProps =
  | (BaseLinkProps & TraditionalLinkProps)
  | (BaseLinkProps & ButtonLinkProps);

const Link = (props: LinkProps) => {
  const classNames = () =>
    addClassNames(
      baseClassName,
      props.wrap && `${baseClassName}-wrap`,
      props.class,
    );

  return (
    <a
      class={classNames()}
      href={"href" in props ? props.href : undefined}
      onClick={"onClick" in props ? props.onClick : undefined}
    >
      {props.children}
    </a>
  );
};

export default Link;
