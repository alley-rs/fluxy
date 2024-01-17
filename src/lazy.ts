import { lazy } from "react";

export const LazySend = lazy(() => import("~/pages/send"));

export const LazyReceive = lazy(() => import("~/pages/receive"));

export const LazyHomeButton = lazy(() => import("~/components/homeButton"));
