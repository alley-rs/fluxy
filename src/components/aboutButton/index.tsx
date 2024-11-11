import { AiOutlineQuestion } from "solid-icons/ai";
import { useContext } from "solid-js";
import { AppContext } from "~/context";
import { LazyFloatButton } from "~/lazy";

const AboutButton = () => {
  const {
    about: { onShow },
    translations,
  } = useContext(AppContext)!;

  return (
    <LazyFloatButton
      icon={<AiOutlineQuestion />}
      tooltip={translations()!.about_button_tooltip}
      onClick={onShow}
    />
  );
};

export default AboutButton;
