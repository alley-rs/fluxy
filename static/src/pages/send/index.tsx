import Upload from "~/components/upload";
import "./index.scss";
import { useContext } from "solid-js";
import LocaleContext from "~/context";

const Send = () => {
  const locale = useContext(LocaleContext)!;

  return (
    <div class="container" id="send">
      <div class="header">{locale.send_page_title}</div>
      <Upload action="/upload" />
    </div>
  );
};

export default Send;
