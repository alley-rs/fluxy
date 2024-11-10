import { Match, Switch, createEffect, createSignal, onMount } from "solid-js";
import { BiRegularSun, BiSolidMoon } from "solid-icons/bi";
import Result from "~/components/result";
import Send from "~/pages/send";
import Receive from "~/pages/receive";
import SwitchDark from "~/components/switch";
import "~/App.scss";
import { getLocale } from "./i18n";
import LocaleContext from "./context";

type Mode = "receive" | "send";

const App = () => {
  const href = window.location.href;
  const url = new URL(href);
  const params = new URLSearchParams(url.search);
  const mode = params.get("mode") as Mode | null;

  const locale = getLocale();

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
    <LocaleContext.Provider value={locale}>
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
          <div class="container">
            <Result
              status="error"
              title={locale.invalid_request}
              description={locale.mode_is_required}
              fullScreen
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
    </LocaleContext.Provider>
  );
};

export default App;
