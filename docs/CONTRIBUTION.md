## 前提

本软件由三部分组成：

- 软件页面 - React
- 软件业务逻辑 - Rust
- 客户端页面 - React

对于想要贡献代码的朋友，前提条件是你至少要掌握 React 或 Rust 其中一门语言。而 React 本质上就是 typescript，所以如果你没接触过 React 但有 typescript 开发经验，只需要很短的时间便可以掌握 React 基础。

## 项目组成部分

### React

#### 软件页面

为了快速开发，页面使用了 antd 组件库编写，但由于软件页面数量较少，使用 antd 时会打包一些额外的代码，我在考虑不依赖任何组件库，重写全部页面。如果你有兴趣，可以在此方面提供代码。

目前软件页面功能尚未达到完全体，但也只有少部分的功能需要添加，比如在接收完成的文件列表项中添加点击事件使用系统的默认程序打开、添加按钮实现接收完成的文件移动到任何目录中等。

因为组件少、页面少，还不需要优化页面性能，但如果你有这方面的经验，也欢迎提交 PR。

#### 客户端页面

在 tauri 未完成对手机操作系统的完全或大体适配前，客户端即为手机浏览器，出于对移动端的适配，我使用的 antd-mobile 开发客户端页面。

但 antd-mobile 的生态不如 antd 完善，一些 antd 中的组件在 antd-mobile 中不存在，比如文件上传组件是我自己完成的，还比较简陋，需要更有经验的前端工程师帮助改进。

文件接收页面使用 List 组件绘制，虽然功能上能够满足，但很丑陋，仍需改进。此外，由于手机操作系统的一些权限和资源分配限制同，很难监控文件的下载进度，尤其是大文件，在开发手机端前不需要添加对下载进度的监听支持。

当前对手机上传进行了并发控制，并发量为2，但此数字我没有经过严格测试，只是为了能够保证并发上传的前提下浏览器不会因为内存占用过高而重载页面。如果你有兴趣，可以对并发量与文件尺寸的对应关系进行改进，避免大、小文件都被限制为 2 并发。

### Rust

后端由两部分组成，一个是负责绘制窗口的 tauri，一个是负责文件接收与发送的 server。

#### tauri

此部分提供前后端交互 api，前端任何想要与系统交互的代码全部通过 tauri::Command 实现。其中最主要的便是文件接收进度向前端的传输。

#### server

本地服务器用来与客户端交互，本质上是一个本地文件服务器。

本软件的开发目的是实现点对点的传输，但当前的 server 尚未对此进行限制，在 server 运行后，可能会被除了目标客户端外的其他客户端影响。

前段有提到，本软件是为了点对点传输，所以广播发现等功能不在考虑之列。

## 其他

前文提到的一些可改进的地方和不考虑的功能均只是一部分，如果有其他疑问，可以通过 issue 提问。


