import { children, mergeProps } from "solid-js";
import { Tooltip } from "../tooltip";

interface MiddleEllipsisTextProps {
  text: string;
  maxLength?: number;
  ellipsis?: string;
}

export default function MiddleEllipsisText(props: MiddleEllipsisTextProps) {
  const merged = mergeProps({ maxLength: 20, ellipsis: "..." } as const, props);

  const resolved = children(() => {
    const str = merged.text ?? "";
    if (str.length <= merged.maxLength) {
      return <span>{str}</span>;
    }

    const half = Math.floor((merged.maxLength - merged.ellipsis.length) / 2);
    const start = str.substring(0, half);
    const end = str.substring(
      str.length - (merged.maxLength - merged.ellipsis.length - half),
    );

    const text = `${start}${merged.ellipsis}${end}`;

    return (
      <Tooltip content={merged.text} position="bottom-start">
        <span>{text}</span>
      </Tooltip>
    );
  });

  return resolved();
}
