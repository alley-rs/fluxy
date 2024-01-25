import { Match, Switch, createSignal } from "solid-js";
import { TbArrowsTransferUp, TbArrowsTransferDown } from "solid-icons/tb";
import Button from "~/components/button";
import "~/App.scss";
import { LazyReceive, LazySend } from "./lazy";
import { suspense } from "./advance";

enum Mode {
  Send,
  Receive,
}

const App = () => {
  const [mode, setMode] = createSignal<Mode | null>(null);

  const toHome = () => setMode(null);

  return (
    <Switch
      fallback={
        <div id="index">
          <div>选择传输方式</div>

          <Button
            class="fill"
            icon={<TbArrowsTransferDown />}
            onClick={() => setMode(Mode.Receive)}
          >
            接收
          </Button>

          <Button
            class="fill"
            icon={<TbArrowsTransferUp />}
            onClick={() => setMode(Mode.Send)}
          >
            发送
          </Button>
        </div>
      }
    >
      <Match when={mode() === Mode.Receive}>
        {suspense(<LazyReceive toHome={toHome} />)}
      </Match>
      <Match when={mode() === Mode.Send}>
        {suspense(<LazySend toHome={toHome} />)}
      </Match>
    </Switch>
  );
};

export default App;
