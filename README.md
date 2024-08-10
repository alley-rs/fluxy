<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [English](./README.en-US.md) | 简体中文

<p align="center"><img height="128" width="128" src="./src-tauri/icons/icon.png" /></p>

# FLUXY

FLUXY 是一款用于局域网内快速文件传输的工具，支持 Windows、macOS 和 Linux，旨在提供流畅的文件交换体验，尤其适用于手机与电脑间的频繁文件传输。

在未开发手机端前，只能通过手机浏览器上传和接收文件，为了更好的上传体验，建议使用 [Edge](https://play.google.com/store/search?q=edge&c=apps)、[Chrome](https://play.google.com/store/search?q=Chrome&c=apps) 、[Firefox](https://play.google.com/store/apps/details?id=org.mozilla.firefox) 或 [QQ浏览器](https://browser.qq.com/mobile)。

## 特点

本软件可能有别于其他同功能软件的特点有：

- 开源

- 体积小

## 使用

启动 FLUXY 后，请选择传输模式：

| 亮色                                             | 暗色                                            |
| ------------------------------------------------ | ----------------------------------------------- |
| ![传输模式选择](./docs/images/light/1-home.avif) | ![传输模式选择](./docs/images/dark/1-home.avif) |

### 接收模式

PC 端显示二维码供手机扫描。

在手机上点击页面最下面的的`选择文件`按钮即可上传多个文件，同时 PC 端也能看到收取文件的进度。

> 点击图片可查看大图。

|      | PC 端扫描前                                                  | 手机端                                                            | PC 端扫描后                                                      | 手机上传                                                         | PC端接收                                                 |
| ---- | ------------------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| 亮色 | ![receive-qrcode](./docs/images/light/2-receive-qrcode.avif) | ![mobile-send-index](./docs/images/light/mobile-send-index.avif)  | ![pc-receive-empty](./docs/images/light/4-pc-receive-empty.avif) | ![mobile-uploading](./docs/images/light/5-mobile-uploading.avif) | ![pc-receiving](./docs/images/light/6-pc-receiving.avif) |
| 暗色 | ![receive-qrcode](./docs/images/dark/2-receive-qrcode.avif)  | ![mobile-send-index](./docs/images/dark/3-mobile-send-index.avif) | ![pc-receive-empty](./docs/images/dark/4-pc-receive-empty.avif)  | ![mobile-uploading](./docs/images/dark/5-mobile-uploading.avif)  | ![pc-receiving](./docs/images/dark/6-pc-receiving.avif)  |

默认保存路径为 `~/Downloads/alley`，可以自行修改。

### 发送模式

选择发送模式后可通过文件管理器将要发送的文件拖入本软件窗口，之后点击确认按钮会出现一个二维码，使用手机扫描后会打开 PC 端发送的文件列表，点击文件名可将文件保存到手机。

_受限于手机操作系统的限制，手机浏览器无法实现批量下载，只能逐个下载。_

> 点击图片可查看大图。

|      | PC 端待选文件                                                | PC 端待发文件列表                                | PC 端发送二维码                                        | 手机端接收页                                                             |
| ---- | ------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| 亮色 | ![wait-selecting](./docs/images/light/7-wait-selecting.avif) | ![selected](./docs/images/light/8-selected.avif) | ![send-qrcode](./docs/images/light/9-send-qrcode.avif) | ![mobile-download-list](./docs/images/light/mobile-download-list.avif)   |
| 暗色 | ![wait-selecting](./docs/images/dark/7-wait-selecting.avif)  | ![selected](./docs/images/dark/8-selected.avif)  | ![send-qrcode](./docs/images/dark/9-send-qrcode.avif)  | ![mobile-download-list](./docs/images/dark/10-mobile-download-list.avif) |

## 常见问题

### macOS 提示已损坏

由于 FLUXY 未经过 Apple 开发者签名，可能会出现系统信任问题。您可以通过以下命令强制信任程序：

```bash
sudo xattr -r -d com.apple.quarantine /Applications/fluxy.app
```

关闭终端后就可以正常打开程序了。

### 缓存清理

前端页面使用系统 WebView 渲染，缓存文件同样也由系统 WebView 创建。

当缓存占据磁盘空间较大时，可以通过一些垃圾清理工具删除或手动删除缓存目录，不会影响程序的运行。
