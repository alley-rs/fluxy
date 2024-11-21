<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> English | [简体中文](./README.md)

<p align="center">
<img height="128" width="128" src="./src-tauri/icons/icon.png" />
<br/>
<a href="https://github.com/alley-rs/fluxy/releases/latest"><img src="https://img.shields.io/github/downloads/alley-rs/fluxy/total.svg?style=flat-square" alt="GitHub releases"></a>
</p>

# FLUXY

FLUXY is a fast file transfer tool for local area networks, supporting Windows, macOS, and Linux. It aims to provide a smooth file exchange experience, particularly for frequent file transfers between mobile phones and computers.

Before developing the mobile app, files could only be uploaded and received through the mobile browser. To improve the upload experience, it is recommended to use [Edge](https://play.google.com/store/search?q=edge&c=apps), [Chrome](https://play.google.com/store/search?q=Chrome&c=apps), [Firefox](https://play.google.com/store/apps/details?id=org.mozilla.firefox), or [QQ Browser](https://browser.qq.com/mobile).

## Features

The key features that distinguish this software from other similar tools:

- Open-source
- Small in size

  | Platform and Format                      | Size (v0.1.0-alpha.7) |
  | ---------------------------------------- | --------------------- |
  | macOS aarch64 - dmg                      | 4.29 MB               |
  | Linux (Debian/Ubuntu/Deepin) amd64 - deb | 6.45 MB               |
  | Windows amd64 - msi                      | 4.29 MB               |
  | Windows amd64 - exe                      | 4.07 MB               |

## Usage

After launching FLUXY, please select the transfer mode:

| Light Mode                                                  | Dark Mode                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| ![Transfer Mode Selection](./docs/images/light/1-home.avif) | ![Transfer Mode Selection](./docs/images/dark/1-home.avif) |

### Receive Mode

The PC will display a QR code for the mobile phone to scan.

On the mobile device, click the "Select File" button at the bottom of the page to upload multiple files, and the PC will also be able to see the progress of the file reception.

> Click the images to view them in full size.

|       | PC Before Scanning                                            | Mobile                                                            | PC After Scanning                                                | Mobile Uploading                                                 | PC Receiving                                             |
| ----- | ------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| Light | ![Receive QR Code](./docs/images/light/2-receive-qrcode.avif) | ![Mobile Send Index](./docs/images/light/mobile-send-index.avif)  | ![PC Receive Empty](./docs/images/light/4-pc-receive-empty.avif) | ![Mobile Uploading](./docs/images/light/5-mobile-uploading.avif) | ![PC Receiving](./docs/images/light/6-pc-receiving.avif) |
| Dark  | ![Receive QR Code](./docs/images/dark/2-receive-qrcode.avif)  | ![Mobile Send Index](./docs/images/dark/3-mobile-send-index.avif) | ![PC Receive Empty](./docs/images/dark/4-pc-receive-empty.avif)  | ![Mobile Uploading](./docs/images/dark/5-mobile-uploading.avif)  | ![PC Receiving](./docs/images/dark/6-pc-receiving.avif)  |

The default save path is `~/Downloads/alley`, which can be modified.

### Send Mode

After selecting the send mode, you can drag the files to be sent into the software window through the file manager, and then click the confirm button to generate a QR code. Scan the QR code with your mobile device to open the list of files sent from the PC, and click the file name to save the file to your mobile phone.

_Due to limitations of mobile operating systems, mobile browsers cannot implement batch downloads, and can only download files one by one._

> Click the images to view them in full size.

|       | PC Waiting for Selection                                         | PC File List                                     | PC Send QR Code                                         | Mobile Receive Page                                                      |
| ----- | ---------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| Light | ![Wait for Selection](./docs/images/light/7-wait-selecting.avif) | ![Selected](./docs/images/light/8-selected.avif) | ![Send QR Code](./docs/images/light/9-send-qrcode.avif) | ![Mobile Download List](./docs/images/light/mobile-download-list.avif)   |
| Dark  | ![Wait for Selection](./docs/images/dark/7-wait-selecting.avif)  | ![Selected](./docs/images/dark/8-selected.avif)  | ![Send QR Code](./docs/images/dark/9-send-qrcode.avif)  | ![Mobile Download List](./docs/images/dark/10-mobile-download-list.avif) |

## Troubleshooting

### macOS "Damaged" Warning

Because FLUXY is not signed by an Apple developer, there may be a system trust issue. You can force trust the program using the following command:

```bash
sudo xattr -r -d com.apple.quarantine /Applications/fluxy.app
```

After closing the terminal, you should be able to open the program normally.

### Clearing Caches

The frontend pages use the system WebView for rendering, and the cache files are also created by the system WebView. When the cache takes up a large amount of disk space, you can delete the cache directory using some cleanup tools or manually, without affecting the program's operation.
