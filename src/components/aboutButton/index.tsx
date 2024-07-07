import { AiOutlineQuestion } from "solid-icons/ai";
import { newAboutWindow } from "~/api";
import { LazyFloatButton } from "~/lazy";

const AboutButton = () => (
  <LazyFloatButton
    icon={<AiOutlineQuestion />}
    tooltip="关于和帮助"
    onClick={newAboutWindow}
  />
);

export default AboutButton;
