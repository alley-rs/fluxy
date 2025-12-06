import { createResource, createSignal, Match, onMount, Switch } from "solid-js";

import * as styles from "~/App.css";
import { AppContext } from "./context";
import { getLocaleTranslations, showMainWindow } from "./api";

import HomePage from "./pages/home";
import { LazyQrcode, LazyReceive, LazySend } from "./lazy";

import TitleBar from "./components/titleBar";
import { Toaster } from "./components/toast";
import { Overlay } from "./components/overlay";

export enum Mode {
  Send = 1,
  Receive = 2,
}

const App = () => {
  const [mode, setMode] = createSignal<Mode | null>(null);
  const [showAbout, setShowAbout] = createSignal<boolean>(false);
  const [translations] = createResource(getLocaleTranslations);

  const [qrCode, setQrCode] = createSignal<QrCode | undefined>();

  const goHomePage = () => {
    setQrCode();
    setMode(null);
  };
  const goReceivePage = () => setMode(Mode.Receive);
  const goSendPage = () => setMode(Mode.Send);

  onMount(() => showMainWindow());

  return (
    <AppContext.Provider
      value={{
        mode,
        qrCode,
        setQrCode,
        goHomePage,
        goReceivePage,
        goSendPage,
        translations,
        about: { show: showAbout, onShow: () => setShowAbout(true) },
      }}
    >
      <TitleBar />

      <LazyQrcode />

      <div class={styles.app}>
        <Switch>
          <Match when={!mode()}>
            <HomePage />
          </Match>

          <Match when={mode() === Mode.Receive}>
            <LazyReceive />
          </Match>

          <Match when={mode() === Mode.Send}>
            <LazySend />
          </Match>
        </Switch>
      </div>

      <Toaster />

      <Overlay />
    </AppContext.Provider>
  );
};

export default App;
