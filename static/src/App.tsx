import { Match, Switch, createEffect, createSignal, onMount } from "solid-js";
import { BiRegularSun, BiSolidMoon } from "solid-icons/bi";
import Result from "~/components/result";
import Send from "~/pages/send";
import Receive from "~/pages/receive";
import SwitchDark from "~/components/switch";
import "~/App.scss";

type Mode = "receive" | "send";

const App = () => {
  const href = window.location.href;
  const url = new URL(href);
  const params = new URLSearchParams(url.search);
  const mode = params.get("mode") as Mode | null;

  const [isDark, setIsDark] = createSignal(false);

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
    <div>
      <SwitchDark
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

      <Switch>
        <Match when={!mode}>
          <div class="container result">
            <Result
              status="error"
              title="无效的请求"
              description="缺少查询参数: mode"
            />
          </div>
        </Match>

        <Match when={mode === "send"}>
          <Send />
        </Match>

        <Match when={mode === "receive"}>
          <Receive />
        </Match>
      </Switch>
    </div>
  );
};

export default App;
