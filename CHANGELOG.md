# Changelog

## 0.1.0

### features

#### Common

- 通过二维码或链接快速连接发送端和接收端
- 页面根据系统主题自动切换暗色模式
- 正式版支持自动检测更新
  - 中国大陆用户通过镜像链接更新
- 部分组件添加过渡动画

#### Send

- Mobile

  - 手机端上传时控制并发量，避免手机浏览器内存溢出
    - 固定并发量为 2
  - 手机端发送时显示实时进度和速度
  - 手机端上传时可中断未完成的上传任务

- Desktop
  - 桌面端发送任务时通过文件服务器的方式与接收端传输文件

#### Receive

- Mobile

  - 因手机操作系统权限问题，手机端通过浏览器下载到默认目录

- Desktop
  - 桌面端接收时显示实时进度和速度
  - 桌面端可配置接收文件的保存目录

### fix

#### Common

- deepin 上非整数倍缩放时窗口比例异常 [3df05a](https://github.com/alley-rs/alley-transfer/commit/ceaaa7bec019e50aad3486c9a4054ed6223df05a)
