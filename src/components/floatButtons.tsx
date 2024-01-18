import { HomeOutlined, ClearOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

interface HomeButtonProps {
  onClick: () => void;
  clear?: () => void;
}

const HomeButton = ({ onClick, clear }: HomeButtonProps) => {
  const homeBtn = (
    <FloatButton tooltip="回到首页" icon={<HomeOutlined />} onClick={onClick} />
  );

  if (!clear) return homeBtn;

  return (
    <FloatButton.Group>
      <FloatButton
        icon={<ClearOutlined />}
        tooltip="清空文件列表"
        onClick={clear}
      />

      {homeBtn}
    </FloatButton.Group>
  );
};

export default HomeButton;
