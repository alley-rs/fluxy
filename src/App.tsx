import { createResource, createSignal, Match, onMount, Switch } from "solid-js";

import * as styles from "~/App.css";
import { AppContext } from "./context";
import { getLocaleTranslations, showMainWindow } from "./api";

import HomePage from "./pages/home";
import { LazyReceive, LazySend } from "./lazy";

import TitleBar from "./components/titleBar";
import { Toaster } from "./components/toast";

export enum Mode {
  Send = 1,
  Receive = 2,
}

const App = () => {
  const [mode, setMode] = createSignal<Mode | null>(null);
  const [showAbout, setShowAbout] = createSignal<boolean>(false);
  const [translations] = createResource(getLocaleTranslations);

  const goHomePage = () => setMode(null);
  const goReceivePage = () => setMode(Mode.Receive);
  const goSendPage = () => setMode(Mode.Send);

  onMount(() => showMainWindow());

  return (
    <AppContext.Provider
      value={{
        mode,
        goHomePage,
        goReceivePage,
        goSendPage,
        translations,
        about: { show: showAbout, onShow: () => setShowAbout(true) },
      }}
    >
      <TitleBar />

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
    </AppContext.Provider>
  );
};

export default App;
