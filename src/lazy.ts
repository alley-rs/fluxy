import { lazy } from "react";

export const LazyFloatButtons = lazy(() => import("~/components/floatButtons"));

export const LazySend = lazy(() => import("~/pages/send"));
export const LazySendFileList = lazy(() => import("~/pages/send/list"));

export const LazyReceive = lazy(() => import("~/pages/receive"));
export const LazyReceiveHeader = lazy(() => import("~/pages/receive/header"));
export const LazyReceiveQrCode = lazy(() => import("~/pages/receive/qrcode"));
