import { mergeProps, type JSXElement } from "solid-js";
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
  filter?: boolean;
}

type LinkProps =
  | (BaseLinkProps & TraditionalLinkProps)
  | (BaseLinkProps & ButtonLinkProps);

const Link = (props: LinkProps) => {
  const merged = mergeProps({ filter: true }, props);

  const classNames = () =>
    addClassNames(
      baseClassName,
      merged.wrap && `${baseClassName}-wrap`,
      merged.filter && `${baseClassName}-filter`,
      merged.class,
    );

  return (
    <a
      class={classNames()}
      href={"href" in merged ? merged.href : undefined}
      onClick={"onClick" in merged ? merged.onClick : undefined}
    >
      {merged.children}
    </a>
  );
};

export default Link;
