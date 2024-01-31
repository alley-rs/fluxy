import { Switch, Match } from "solid-js";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillInfoCircle,
} from "solid-icons/ai";
import "./index.scss";
import { addClassNames } from "../utils";

interface ResultProps {
  class?: string;
  style?: CSSProperties;
  status: "info" | "error" | "success";
  title: string;
  description?: string;
  fullScreen?: boolean;
}

const baseClassName = "result";

const Result = (props: ResultProps) => {
  const classNames = () =>
    addClassNames(
      baseClassName,
      `${baseClassName}-${props.status}`,
      props.fullScreen && `${baseClassName}-full-screen`,
      props.class,
    );

  return (
    <div class={classNames()}>
      <div class={`${baseClassName}-icon`}>
        <Switch>
          <Match when={props.status === "error"}>
            <AiFillCloseCircle />
          </Match>

          <Match when={props.status === "info"}>
            <AiFillInfoCircle />
          </Match>

          <Match when={props.status === "success"}>
            <AiFillCheckCircle />
          </Match>
        </Switch>
      </div>
      <div class={`${baseClassName}-title`}>{props.title}</div>
      <div class={`${baseClassName}-description`}>{props.description}</div>
    </div>
  );
};

export default Result;
