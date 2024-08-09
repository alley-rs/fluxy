import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { BiRegularSun, BiSolidMoon } from "solid-icons/bi";
import { LazyFlex, LazySwitch, LazyTooltip } from "./lazy";
import "~/App.scss";
import useDark from "alley-components/lib/hooks/useDark";
import RippleEffect from "./components/ripple";
import { initMulticast } from "./api";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { createStore } from "solid-js/store";
import { AiFillAndroid } from "solid-icons/ai";

const appWindow = getCurrentWebviewWindow();

const App = () => {
  const [isDark, setIsDark] = useDark();

  const [remoteAccesses, setRemoteAccesses] = createStore<Remote[]>([]);
  const [receiveEvent, setReceiveEvent] = createSignal<ReceiveEvent | null>(
    null,
  );

  onMount(() => {
    const unlisten = appWindow.listen<ReceiveEvent>(
      "multicast:receive-event",
      (e) => {
        setReceiveEvent(e.payload);
        console.log(e.payload);
      },
    );

    onCleanup(() => {
      unlisten.then((f) => f());
    });
  });

  onMount(() => {
    const unlisten = appWindow.listen<Remote>("multicast:message", (e) => {
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
        <Show when={receiveEvent() !== "End"}>
          <RippleEffect />
        </Show>

        <Show
          when={!remoteAccesses.length}
          fallback={<div>已搜索到设备：</div>}
        >
          <Show
            when={receiveEvent() === "End"}
            fallback={<div>正在搜索其他设备...</div>}
          >
            <div>搜索结束</div>
          </Show>
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
