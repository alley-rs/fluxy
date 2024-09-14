import { AiOutlineQuestion } from "solid-icons/ai";
import { useContext } from "solid-js";
import { AppContext } from "~/context";
import { LazyFloatButton } from "~/lazy";

const AboutButton = () => {
  const {
    about: { onShow },
  } = useContext(AppContext)!;

  return (
    <LazyFloatButton
      icon={<AiOutlineQuestion />}
      tooltip="关于和帮助"
      onClick={onShow}
    />
  );
};

export default AboutButton;
