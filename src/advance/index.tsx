import type { JSXElement } from "solid-js";
import { Suspense } from "solid-js";

export const suspense = (component: JSXElement) => (
  <Suspense fallback={<div>Loading...</div>}>{component}</Suspense>
);
