<p align="center"><img height="128" width="128" src="./src-tauri/icons/icon.png" /></p>

# ALLEY

在局域网的同网段中各终端快速互传文件的工具，适配 Windows、macOS 和 Linux 桌面发行版，为频繁在手机与电脑间互传文件的用户提供便捷、舒适的体验。

在未开发手机端前，只能通过手机浏览器上传和接收文件，建议使用 [Edge](https://play.google.com/store/search?q=edge&c=apps)、[Chrome](https://play.google.com/store/search?q=Chrome&c=apps) 、[Firefox](https://play.google.com/store/apps/details?id=org.mozilla.firefox) 或 [QQ浏览器](https://browser.qq.com/mobile)。

## 特点

本软件可能有别于其他同功能软件的特点有：

- 开源

- 体积小

  | 平台及格式                              | 体积    |
  | --------------------------------------- | ------- |
  | macOS aarch64 - dmg                     | 4.24 MB |
  | Linux(Debian/Ubuntu/Deepin) amd64 - deb | 6.2 MB  |
  | Windows amd64 - msi                     | 4.03 MB |
  | Windows amd64 - exe                     | 3.26 MB |

- 页面丑（缺少设计天份）

## 使用

打开软件后需要选择传输模式：

![传输模式选择](./docs/images/home.png)

### 接收模式

选择接收模式后会出现一个二维码，使用手机扫描二维码会通过默认浏览器打开一个页面，同时 PC 端的页面也会变化。

| PC 端扫描前                                 | 手机端                                         | PC 端扫描后                                   |
| ------------------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| ![output](./docs/images/receive-qrcode.png) | ![output](./docs/images/mobile-send-index.png) | ![output](./docs/images/pc-receive-empty.png) |

在手机上点击页面中间的`upload`按钮即可上传多个文件，同时 PC 端也能看到收取文件的进度。

| 手机端上传                                    | PC端接收                                  |
| --------------------------------------------- | ----------------------------------------- |
| ![output](./docs/images/mobile-uploading.png) | ![output](./docs/images/pc-receiving.png) |

所有平台的 PC 端接收到的文件默认保存路径均为`~/Downloads/alley`，你可以自行修改保存目录。

### 发送模式

选择发送模式后可通过文件管理器将要发送的文件拖入本软件窗口，之后点击确认按钮会出现一个二维码，使用手机扫描后会打开 PC 端发送的文件列表，点击文件名可将文件保存到手机。

_受限于手机操作系统的限制，手机浏览器无法实现批量下载，只能逐个下载。_

| PC 端待选文件                               | PC 端待发文件列表                     | PC 端发送二维码                          | 手机端接收页                                      |
| ------------------------------------------- | ------------------------------------- | ---------------------------------------- | ------------------------------------------------- |
| ![output](./docs/images/wait-selecting.png) | ![output](./docs/images/selected.png) | ![output](./docs/images/send-qrcode.png) | ![output](./docs/images/mobile-download-list.png) |
