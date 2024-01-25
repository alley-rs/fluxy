import "./index.scss";

interface ProgressProps {
  percent?: number;
}

const baseClassName = "progress-bar";

const Progress = (props: ProgressProps) => {
  const fillStyle: () => CSSProperties = () => {
    console.log(props.percent);
    return {
      width: props.percent ? `${props.percent}%` : 0,
    };
  };

  return (
    <div class={baseClassName}>
      <div class={`${baseClassName}-trail`}>
        <div
          class={
            props.percent === 100
              ? `${baseClassName}-fill-success`
              : `${baseClassName}-fill`
          }
          style={fillStyle()}
        ></div>
      </div>
    </div>
  );
};

export default Progress;
