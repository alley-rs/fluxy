import { useState, useEffect } from "react";
import { Row, Col, Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { open as pick } from "@tauri-apps/api/dialog";
import { open } from "@tauri-apps/api/shell";
import { changeDownloadsDir, getDownloadsDir } from "~/api";
import Loading from "~/components/loading";

const Header = () => {
  const [downloadDir, setDownloadDir] = useState<string | undefined>(undefined);
  const [openDropDown, setOpenDropDown] = useState(false);

  useEffect(() => {
    if (downloadDir) return;

    getDownloadsDir().then((d) => setDownloadDir(d));
  }, []);

  const pickDirectory = async () => {
    const dir = (await pick({
      directory: true,
      defaultPath: downloadDir,
      multiple: false,
    })) as string | null;

    if (!dir) return;

    await changeDownloadsDir(dir);

    setDownloadDir(dir);
  };

  const DirectoryDropdownItems: MenuProps["items"] = [
    {
      key: "1",
      label: <a>打开</a>,
      onClick: () => open(downloadDir!),
    },
    {
      key: "2",
      label: <a>修改</a>,
      onClick: () => pickDirectory(),
    },
  ];

  if (!downloadDir) return <Loading />;

  return (
    <Row className="header">
      <Col span={6} className="directory-button-label">
        <span style={{ fontSize: "0.8rem" }}>保存目录：</span>
      </Col>

      <Col span={18}>
        <Dropdown
          open={openDropDown}
          onOpenChange={() => setOpenDropDown((pre) => !pre)}
          menu={{ items: DirectoryDropdownItems }}
          placement="bottomRight"
          arrow
          overlayStyle={{ minWidth: 0 }}
        >
          <Button
            className="directory-button"
            type="link"
            onClick={async () => {
              setOpenDropDown(false);
              open(downloadDir);
            }}
            style={{ textOverflow: "ellipsis" }}
          >
            {downloadDir}
          </Button>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default Header;
