import { Match, Switch, createSignal, onMount } from "solid-js";
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
import { getStarState, stared } from "./api";
import { confirm, message } from "@tauri-apps/api/dialog";
import { open } from "@tauri-apps/api/shell";

enum Mode {
  Send = 1,
  Receive = 2,
}

const App = () => {
  const [isDark, setIsDark] = useDark();

  const [mode, setMode] = createSignal<Mode | null>(null);

  onMount(() => {
    const star = async () => {
      const starState = await getStarState();
      if (starState) return;

      const ok = await confirm("点个 star 支持一下?", {
        okLabel: "没问题",
        cancelLabel: "以后再说",
      });
      if (!ok) {
        return;
      }

      open("https://github.com/alley-rs/fluxy");

      const confirmed = await confirm(
        "本提示是君子协定，你点击确认后将不会再弹出本弹窗",
        { title: "你是否已 star？", okLabel: "是的", cancelLabel: "没有" },
      );
      if (!confirmed) return;

      message("感谢您支持开源项目");

      stared();
    };

    star();
  });

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
