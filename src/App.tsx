import { Match, Switch, createSignal } from "solid-js";
import { TbArrowsTransferUp, TbArrowsTransferDown } from "solid-icons/tb";
import { BiRegularSun, BiSolidMoon } from "solid-icons/bi";
import {
  LazyButton,
  LazyReceive,
  LazySend,
  LazySwitch,
  LazyTooltip,
} from "./lazy";
import { suspense } from "./advance";
import "~/App.scss";
import useDark from "alley-components/lib/hooks/useDark";

enum Mode {
  Send,
  Receive,
}

const App = () => {
  const [isDark, setIsDark] = useDark();

  const [mode, setMode] = createSignal<Mode | null>(null);

  const toHome = () => setMode(null);

  return (
    <>
      <LazyTooltip text={`切换为${isDark() ? "亮" : "暗"}色`} placement="left">
        <LazySwitch
          class="dark-switch"
          checked={isDark()}
          setChecked={() => {
            setIsDark((pre) => {
              return !pre;
            });
          }}
          uncheckedChild={<BiRegularSun />}
          checkedChild={<BiSolidMoon />}
        />
      </LazyTooltip>

      <Switch
        fallback={
          <div id="index">
            <div>选择传输方式</div>

            {suspense(
              <LazyButton
                class="fill"
                icon={<TbArrowsTransferDown />}
                onClick={() => setMode(Mode.Receive)}
              >
                接收
              </LazyButton>,
            )}

            {suspense(
              <LazyButton
                class="fill"
                icon={<TbArrowsTransferUp />}
                onClick={() => setMode(Mode.Send)}
              >
                发送
              </LazyButton>,
            )}
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
    </>
  );
};

export default App;
