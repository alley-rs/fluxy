import { useContext } from "solid-js";

import { LazyButton } from "~/lazy";

import { AppContext } from "~/context";

import About from "~/components/about";

import * as styles from "./index.css";

const HomePage = () => {
  const { goReceivePage, goSendPage, translations } = useContext(AppContext)!;

  return (
    <div class={styles.home}>
      <div class={styles.header}>
        <h1 class={styles.title}>FLUXY</h1>

        <About />
      </div>

      <div class={styles.buttons}>
        <LazyButton class={styles.button} size="lg" onClick={goSendPage}>
          <div
            classList={{
              [styles.sendIcon]: true,
              [styles.buttonIcon]: true,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
              <path d="m21.854 2.147-10.94 10.939"></path>
            </svg>
          </div>
          {translations()?.home_send_button_text}
        </LazyButton>

        <LazyButton class={styles.button} size="lg" onClick={goReceivePage}>
          <div
            classList={{
              [styles.receiveIcon]: true,
              [styles.buttonIcon]: true,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 15V3"></path>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <path d="m7 10 5 5 5-5"></path>
            </svg>
          </div>
          {translations()?.home_receive_button_text}
        </LazyButton>
      </div>
    </div>
  );
};

export default HomePage;
