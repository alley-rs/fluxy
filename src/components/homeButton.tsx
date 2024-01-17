import { HomeOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

interface HomeButtonProps {
  onClick: () => void;
}

const HomeButton = ({ onClick }: HomeButtonProps) => (
  <FloatButton tooltip="回到首页" icon={<HomeOutlined />} onClick={onClick} />
);

export default HomeButton;
