import { Show } from "solid-js";
import { addClassNames } from "../utils";
import "./index.scss";

interface ProgressProps {
  class?: string;
  percent?: number;
  float?: boolean;
}

const baseClassName = "progress";

const Progress = (props: ProgressProps) => {
  const classNames = () =>
    addClassNames(
      baseClassName,
      props.class,
      props.float ? `${baseClassName}-float` : undefined,
    );

  const fillStyle = (): CSSProperties => ({
    width: props.percent ? `${props.percent}%` : 0,
  });

  return (
    <div class={classNames()}>
      <div class={`${baseClassName}-trail`}>
        <Show when={props.percent}>
          <div
            class={
              props.percent === 100
                ? `${baseClassName}-fill-success`
                : `${baseClassName}-fill`
            }
            data-percent={Math.round(props.percent ?? 0)}
            style={fillStyle()}
          />
        </Show>
      </div>
    </div>
  );
};

export default Progress;
