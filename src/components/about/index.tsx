import { createResource } from "solid-js";

import { AiFillGithub } from "solid-icons/ai";

import { getVersion } from "@tauri-apps/api/app";

import { open } from "@tauri-apps/plugin-shell";

import { LazyButton, LazyFlex } from "~/lazy";

import * as styles from "./index.css";

const About = () => {
  const [version] = createResource(getVersion);

  return (
    <LazyFlex
      class={styles.about}
      justify="center"
      align="center"
      direction="vertical"
    >
      <LazyButton
        class={styles.aboutButton}
        icon={<AiFillGithub font-size="16px" />}
        shape="circle"
        size="sm"
        onClick={() => open("https://github.com/alley-rs/fluxy")}
      />

      <LazyButton
        class={styles.aboutButton}
        variant="text"
        size="sm"
        onClick={() =>
          open("https://github.com/alley-rs/fluxy/releases/latest")
        }
      >
        {version()}
      </LazyButton>
    </LazyFlex>
  );
};

export default About;
