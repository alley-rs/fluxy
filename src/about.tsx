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
import { createSignal, onMount, useContext } from "solid-js";
import { app } from "@tauri-apps/api";
import { AiFillGithub } from "solid-icons/ai";
import { RiCommunicationFeedbackLine } from "solid-icons/ri";
import { open } from "@tauri-apps/api/shell";
import "./about.scss";
import { AppContext } from "./context";

const About = () => {
  const { translations } = useContext(AppContext)!;
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
        <LazyTooltip
          text={translations()!.about_dialog_github_tooltip}
          placement="top"
        >
          <LazyButton
            icon={<AiFillGithub />}
            type="plain"
            shape="circle"
            onClick={() => open("https://github.com/alley-rs/fluxy")}
          />
        </LazyTooltip>

        <LazyTooltip
          text={translations()!.about_dialog_feedback_tooltip}
          placement="top"
        >
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
