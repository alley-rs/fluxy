import { Match, Switch, createSignal, onMount, createEffect } from "solid-js";
import { TbArrowsTransferUp, TbArrowsTransferDown } from "solid-icons/tb";
import { BiRegularSun, BiSolidMoon } from "solid-icons/bi";
import { LazyButton, LazyReceive, LazySend, LazySwitch } from "./lazy";
import { suspense } from "./advance";
import "~/App.scss";

enum Mode {
  Send,
  Receive,
}

const App = () => {
  const [isDark, setIsDark] = createSignal(false);

  const [mode, setMode] = createSignal<Mode | null>(null);

  const toHome = () => setMode(null);

  onMount(() => {
    // 设置默认主题色
    if (matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }

    // 监听系统颜色切换
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (event.matches) {
          setIsDark(true);
        } else {
          setIsDark(false);
        }
      });
  });

  // 手动切换主题色
  createEffect(() => {
    if (isDark()) window.document.documentElement.setAttribute("class", "dark");
    else window.document.documentElement.removeAttribute("class");
  });

  return (
    <>
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

      <Switch
        fallback={
          <div id="index">
            <div>选择传输方式</div>

            {suspense(
              <LazyButton
                class="fill"
                filter={false} // FIX: 不知道什么原因主页图标的 filter 会有残留, 暂时关闭
                block
                icon={<TbArrowsTransferDown />}
                onClick={() => setMode(Mode.Receive)}
              >
                接收
              </LazyButton>,
            )}

            {suspense(
              <LazyButton
                class="fill"
                filter={false} // FIX: 不知道什么原因主页图标的 filter 会有残留, 暂时关闭
                block
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
