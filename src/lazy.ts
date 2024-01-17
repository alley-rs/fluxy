import { lazy } from "react";

export const LazyHomeButton = lazy(() => import("~/components/homeButton"));

export const LazySend = lazy(() => import("~/pages/send"));

export const LazyReceive = lazy(() => import("~/pages/receive"));
export const LazyReceiveHeader = lazy(() => import("~/pages/receive/header"));
export const LazyReceiveQrCode = lazy(() => import("~/pages/receive/qrcode"));
