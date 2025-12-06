import { lazy } from "solid-js";

export const LazyButton = lazy(() => import("~/components/button"));

export const LazyFlex = lazy(() => import("~/components/flex"));

export const LazyDialog = lazy(() => import("~/components/dialog"));

export const LazyText = lazy(() => import("~/components/text"));

export const LazyTooltip = lazy(() => import("~/components/tooltip"));

export const LazyCard = lazy(() => import("~/components/card"));

export const LazyQrcode = lazy(() => import("~/components/qrcode"));

export const LazySend = lazy(() => import("~/pages/send"));

export const LazyReceive = lazy(() => import("~/pages/receive"));
export const LazyReceiveHeader = lazy(() => import("~/pages/receive/header"));
