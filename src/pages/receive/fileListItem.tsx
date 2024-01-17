import { Col, Progress, Row } from "antd";

interface FileListItemProps {
  name: string;
  percent: number;
  speed?: number;
  size: string;
}

const FileListItem = ({ name, percent, speed, size }: FileListItemProps) => (
  <li className="receive-file-list-item">
    <div
      style={{
        textAlign: "left",
        fontSize: "0.8rem",
        color: percent < 100 ? "#959595" : "var(--ant-color-text-base)",
      }}
    >
      <Row gutter={10}>
        <Col span={speed ? 12 : 18}>
          <h4 className="filename">{name}</h4>
        </Col>

        {speed ? <Col span={6}>{`${speed.toFixed(1)} MB/s`}</Col> : null}

        <Col span={6}>{size}</Col>
      </Row>
    </div>
    <Progress percent={percent} />
  </li>
);

export default FileListItem;
