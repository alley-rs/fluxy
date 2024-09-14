import { Match, Switch, createSignal, onMount } from "solid-js";
import { TbArrowsTransferUp, TbArrowsTransferDown } from "solid-icons/tb";
import { BiRegularSun, BiSolidMoon } from "solid-icons/bi";
import {
  LazyAboutButton,
  LazyButton,
  LazyDialog,
  LazyReceive,
  LazySend,
  LazySwitch,
  LazyTooltip,
} from "./lazy";
import { suspense } from "./advance";
import "~/App.scss";
import useDark from "alley-components/lib/hooks/useDark";
import About from "./about";
import { AppContext } from "./context";
import { showMainWindow } from "./api";

enum Mode {
  Send = 1,
  Receive = 2,
}

const App = () => {
  const [isDark, setIsDark] = useDark();

  const [mode, setMode] = createSignal<Mode | null>(null);
  const [showAbout, setShowAbout] = createSignal<boolean>(false);

  const goHome = () => setMode(null);

  onMount(() => showMainWindow());

  return (
    <AppContext.Provider
      value={{
        goHome,
        about: { show: showAbout, onShow: () => setShowAbout(true) },
      }}
    >
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

            <LazyAboutButton />
          </div>
        }
      >
        <Match when={mode() === Mode.Receive}>
          {suspense(<LazyReceive />)}
        </Match>
        <Match when={mode() === Mode.Send}>{suspense(<LazySend />)}</Match>
      </Switch>

      <LazyDialog
        show={showAbout()}
        onClose={() => setShowAbout(false)}
        showCloseIcon
        showMask
      >
        <About />
      </LazyDialog>
    </AppContext.Provider>
  );
};

export default App;
