<p align="center"><img height="128" width="128" src="./src-tauri/icons/icon.png" /></p>

# ALLEY

在局域网中使用手机快速向 PC 传递文件的工具，适配 Windows、macOS 和 Linux 桌面发行版。

## 特点

本软件可能有别于其他同功能软件的特点有：

- 开源

- 体积小

  | 平台及格式                              | 体积    |
  | --------------------------------------- | ------- |
  | macOS aarch64 - dmg                     | 4.06 MB |
  | Linux(Debian/Ubuntu/Deepin) amd64 - deb | 5.94 MB |
  | Windows amd64 - msi                     | 3.85 MB |
  | Windows amd64 - exe                     | 3.17 MB |

- 页面丑（缺少设计天份）

## 使用

打开 PC 端后有一个二维码，使用手机扫描二维码会通过默认浏览器打开一个页面，同时 PC 端的页面也会变化。

| PC 端扫描前                                                  | 手机端                                                       | PC 端扫描后                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![output](https://raw.githubusercontent.com/thep0y/image-bed/main/up2b/%E6%88%AA%E5%B1%8F2024-01-13%2015.15.56_1705130245959.png) | ![output](https://raw.githubusercontent.com/thep0y/image-bed/main/up2b/192.168.31.222_5800_(iPhone%20SE)_1705130440970.png) | ![output](https://raw.githubusercontent.com/thep0y/image-bed/main/up2b/%E6%88%AA%E5%B1%8F2024-01-13%2015.20.52_1705130455720.png) |

在手机上点击页面中间的`upload`按钮即可上传多个文件，同时 PC 端也能看到收取文件的进度。

| 手机端上传                                                   | PC端接收                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![output](https://raw.githubusercontent.com/thep0y/image-bed/main/up2b/output_1705130649364.png) | ![output](https://raw.githubusercontent.com/thep0y/image-bed/main/up2b/output_1705130899329.png) |

所有平台的 PC 端接收到的文件保存路径均为`~/Downloads/alley`。

