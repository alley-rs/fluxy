import type { JSXElement } from "solid-js";
import { Suspense } from "solid-js";
import Loading from "~/components/loading";

export const suspense = (component: JSXElement) => (
  <Suspense fallback={<Loading />}>{component}</Suspense>
);
