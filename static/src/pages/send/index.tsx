import Upload from "~/components/upload";
import "./index.scss";

const Send = () => {
  return (
    <div class="container">
      <Upload action="/upload" />
    </div>
  );
};

export default Send;
