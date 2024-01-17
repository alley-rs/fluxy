import Upload from "~/components/upload";
import "./index.scss";

const Send = () => {
  return (
    <div className="container">
      <Upload action="/upload" />
    </div>
  );
};

export default Send;
