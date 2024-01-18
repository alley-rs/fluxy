import React, { Suspense } from "react";
import Loading from "~/components/loading";

export const suspense = (component: React.ReactNode) => (
  <Suspense fallback={<Loading />}>{component}</Suspense>
);
