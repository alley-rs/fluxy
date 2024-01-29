<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [English](./README.md) | 简体中文

<p align="center"><img height="128" width="128" src="./src-tauri/icons/icon.png" /></p>

# ALLEY

在局域网的同网段中各终端快速互传文件的工具，适配 Windows、macOS 和 Linux 桌面发行版，为频繁在手机与电脑间互传文件的用户提供便捷、舒适的体验。

在未开发手机端前，只能通过手机浏览器上传和接收文件，为了更好的上传体验，建议使用 [Edge](https://play.google.com/store/search?q=edge&c=apps)、[Chrome](https://play.google.com/store/search?q=Chrome&c=apps) 、[Firefox](https://play.google.com/store/apps/details?id=org.mozilla.firefox) 或 [QQ浏览器](https://browser.qq.com/mobile)。

## 特点

本软件可能有别于其他同功能软件的特点有：

- 开源

- 体积小

  | 平台及格式                              | 体积（v0.1.0-alpha.11） |
  | --------------------------------------- | ----------------------- |
  | macOS aarch64 - dmg                     | 3.83 MB                 |
  | Linux(Debian/Ubuntu/Deepin) amd64 - deb | 5.64 MB                 |
  | Windows amd64 - msi                     | 3.65 MB                 |
  | Windows amd64 - exe                     | 3.11 MB                 |

## 使用

打开软件后需要选择传输模式：

| 亮色                                          | 暗色                                           |
| --------------------------------------------- | ---------------------------------------------- |
| ![传输模式选择](./docs/images/light/home.png) | ![传输模式选择](./docs/images/dark/1-home.png) |

### 接收模式

选择接收模式后会出现一个二维码，使用手机扫描二维码会通过默认浏览器打开一个页面，同时 PC 端的页面也会变化。

在手机上点击页面最下面的的`选择文件`按钮即可上传多个文件，同时 PC 端也能看到收取文件的进度。

> 点击图片可查看大图。

|      | PC 端扫描前                                        | 手机端                                                       | PC 端扫描后                                                  | 手机上传                                                     | PC端接收                                                     |
| ---- | -------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 亮色 | ![output](./docs/images/light/receive-qrcode.png)  | ![output](./docs/images/light/mobile-send-index.png)         | ![output](./docs/images/light/pc-receive-empty.png)          | ![output](./docs/images/light/mobile-uploading.png)          | ![output](./docs/images/light/pc-receiving.png)              |
| 暗色 | ![output](./docs/images/dark/2-receive-qrcode.png) | ![3-mobile-send-index](./docs/images/dark/3-mobile-send-index.png) | ![4-pc-receive-empty](./docs/images/dark/4-pc-receive-empty.png) | ![5-mobile-uploading](./docs/images/dark/5-mobile-uploading.png) | ![6-pc-receiving.png](./docs/images/dark/6-pc-receiving.png.png) |

所有平台的 PC 端接收到的文件默认保存路径均为`~/Downloads/alley`，你可以自行修改保存目录。

### 发送模式

选择发送模式后可通过文件管理器将要发送的文件拖入本软件窗口，之后点击确认按钮会出现一个二维码，使用手机扫描后会打开 PC 端发送的文件列表，点击文件名可将文件保存到手机。

_受限于手机操作系统的限制，手机浏览器无法实现批量下载，只能逐个下载。_

> 点击图片可查看大图。

|      | PC 端待选文件                                                | PC 端待发文件列表                                | PC 端发送二维码                                        | 手机端接收页                                                 |
| ---- | ------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------ |
| 亮色 | ![output](./docs/images/light/wait-selecting.png)            | ![output](./docs/images/light/selected.png)      | ![output](./docs/images/light/send-qrcode.png)         | ![output](./docs/images/light/mobile-download-list.png)      |
| 暗色 | ![7-wait-selecting](./docs/images/dark/7-wait-selecting.png) | ![8-selected](./docs/images/dark/8-selected.png) | ![9-send-qrcode](./docs/images/dark/9-send-qrcode.png) | ![10-mobile-download-list](./docs/images/dark/10-mobile-download-list.png) |
