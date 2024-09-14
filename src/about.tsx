import {
  LazyButton,
  LazyFlex,
  LazyLabel,
  LazySpace,
  LazyTooltip,
  LazyTypographyText,
  LazyTypographyTitle,
} from "./lazy";
import useDark from "alley-components/lib/hooks/useDark";
import { createSignal, onMount } from "solid-js";
import { app } from "@tauri-apps/api";
import { AiFillGithub } from "solid-icons/ai";
import { RiCommunicationFeedbackLine } from "solid-icons/ri";
import { open } from "@tauri-apps/api/shell";
import "./about.scss";

const About = () => {
  const [name, setName] = createSignal("");
  const [version, setVersion] = createSignal("");

  useDark();
  onMount(() => {
    app.getName().then((n) => setName(n));
    app.getVersion().then((v) => setVersion(v));
  });

  return (
    <LazyFlex direction="vertical" align="center">
      <img src="/icon.png" aria-label="fluxy" width="64" />

      <LazyTypographyTitle level={5}>{name()}</LazyTypographyTitle>

      <LazySpace style={{ "font-size": "0.8rem" }}>
        <LazyLabel>version</LazyLabel>
        <LazyTypographyText style={{ "font-size": "0.8rem" }}>
          {version()}
        </LazyTypographyText>
      </LazySpace>

      <LazySpace>
        <LazyTooltip text="访问官网" placement="top">
          <LazyButton
            icon={<AiFillGithub />}
            type="plain"
            shape="circle"
            onClick={() => open("https://github.com/alley-rs/fluxy")}
          />
        </LazyTooltip>

        <LazyTooltip text="反馈问题或寻求帮助" placement="top">
          <LazyButton
            icon={<RiCommunicationFeedbackLine />}
            type="plain"
            shape="circle"
            onClick={() => open("https://github.com/alley-rs/fluxy/issues/new")}
          />
        </LazyTooltip>
      </LazySpace>
    </LazyFlex>
  );
};

export default About;
