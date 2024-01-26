import { lazy } from "solid-js";

export const LazyButton = lazy(() => import("~/components/button"));
export const LazyRow = lazy(() => import("~/components/row"));
export const LazyCol = lazy(() => import("~/components/col"));
export const LazyProgress = lazy(() => import("~/components/progress"));
export const LazyDropdown = lazy(() => import("~/components/dropdown"));
export const LazyLink = lazy(() => import("~/components/link"));
export const LazyFlex = lazy(() => import("~/components/flex"));
export const LazyEmpty = lazy(() => import("~/components/empty"));
export const LazyList = lazy(() => import("~/components/list"));

export const LazyFloatButtons = lazy(() => import("~/components/floatButton"));

export const LazySend = lazy(() => import("~/pages/send"));
// export const LazySendFileList = lazy(() => import("~/pages/send/list"));

export const LazyReceive = lazy(() => import("~/pages/receive"));
export const LazyReceiveHeader = lazy(() => import("~/pages/receive/header"));
export const LazyReceiveQrCode = lazy(() => import("~/pages/receive/qrcode"));
