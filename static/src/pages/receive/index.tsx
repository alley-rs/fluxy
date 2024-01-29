import { Match, Switch, createResource } from "solid-js";
import { AiOutlineCloudDownload } from "solid-icons/ai";
import Result from "~/components/result";
import SpinLoading from "~/components/loading/spin";
import Space from "~/components/space";
import Toast from "~/components/toast";
import List from "~/components/list";
import fileType from "./fileType";
import Link from "~/components/link";
import "./index.scss";

type ResponseData = SendFile[] | BadRequest;

const fetchData = async (): Promise<ResponseData> => {
  const response = await fetch("/files");

  if (response.status !== 200) {
    const msg = await response.json();
    return msg;
  }

  const body: SendFile[] = await response.json();
  return body;
};

const Receive = () => {
  const [data] = createResource(fetchData);

  return (
    <div class="container">
      <div class="header">接收文件</div>

      <Switch>
        <Match when={data.loading || !data()}>
          <SpinLoading />
        </Match>

        <Match when={"error" in data()!}>
          <div
            class="content"
            style={{ "justify-content": "center", "align-items": "center" }}
          >
            <Result
              status="error"
              title={(data()! as BadRequest).error}
              description={(data()! as BadRequest).advice ?? undefined}
            />
          </div>
        </Match>

        <Match when={(data() as SendFile[]).length}>
          <div class="content">
            <Toast
              message="不要刷新此页面，否则文件列表将会被清空"
              duration={3000}
            />

            <List
              class="receive-file-list"
              header="点击文件名或右侧按钮即可下载"
              dataSource={data() as SendFile[]}
              renderItem={(item, index) => {
                const url = "/download/" + encodeURIComponent(item.path);
                return (
                  <List.Item
                    title={
                      <span class="filename">
                        <span class="label">{index + 1}.</span>
                        <Link
                          download={item.name}
                          href={url}
                          class="download-url"
                        >
                          {item.name}
                        </Link>
                      </span>
                    }
                    description={
                      <Space gap={12} class="file-description">
                        <span>大小：{item.size}</span>
                        <span>类型：{fileType(item.extension)}</span>
                      </Space>
                    }
                    extra={[
                      <Link
                        download={item.name}
                        href={url}
                        class="download-icon"
                      >
                        <AiOutlineCloudDownload />
                      </Link>,
                    ]}
                  />
                );
              }}
            />
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default Receive;
