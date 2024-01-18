import { List, Avatar, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import avatar from "./avatar";

interface SendFileListProps {
  data: SendFile[];
  removeFile: (path: string) => void;
}

const SendFileList = ({ data, removeFile }: SendFileListProps) => {
  return (
    <List
      style={{ padding: "0 5px" }}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item
          key={index}
          actions={[
            <a className="delete-button" onClick={() => removeFile(item.path)}>
              {<DeleteOutlined />}{" "}
            </a>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar icon={avatar(item.extension)} />}
            title={item.name}
            description={<Space>大小:{item.size}</Space>}
          />
        </List.Item>
      )}
    />
  );
};

export default SendFileList;
