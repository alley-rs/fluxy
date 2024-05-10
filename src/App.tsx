import { For, Show, onCleanup, onMount } from "solid-js";
import { BiRegularSun, BiSolidMoon } from "solid-icons/bi";
import { LazyFlex, LazySwitch, LazyTooltip } from "./lazy";
import "~/App.scss";
import useDark from "alley-components/lib/hooks/useDark";
import RippleEffect from "./components/ripple";
import { initMulticast } from "./api";
import { getCurrent } from "@tauri-apps/api/webviewWindow";
import { createStore } from "solid-js/store";
import { AiFillAndroid } from "solid-icons/ai";

const appWindow = getCurrent();

const App = () => {
  const [isDark, setIsDark] = useDark();

  const [remoteAccesses, setRemoteAccesses] = createStore<Remote[]>([]);

  onMount(() => {
    const unlisten = appWindow.listen<Remote>("multicast", (e) => {
      setRemoteAccesses(remoteAccesses.length, e.payload);
    });
    initMulticast();

    onCleanup(() => {
      unlisten.then((f) => f());
    });
  });

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

      <LazyFlex
        direction="vertical"
        align="center"
        justify="center"
        style={{ width: "100%" }}
        gap={16}
      >
        <RippleEffect />

        <Show
          when={!remoteAccesses.length}
          fallback={<div>已搜索到设备：</div>}
        >
          <div>正在搜索其他设备...</div>
        </Show>

        <For each={remoteAccesses}>
          {(item) => {
            return (
              <div>
                <AiFillAndroid /> {item.name}
              </div>
            );
          }}
        </For>
      </LazyFlex>
    </>
  );
};

export default App;
