import type { JSX } from "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface SvgSVGAttributes<T>
      extends ContainerElementSVGAttributes<T>,
      NewViewportSVGAttributes<T>,
      ConditionalProcessingSVGAttributes,
      ExternalResourceSVGAttributes,
      StylableSVGAttributes,
      FitToViewBoxSVGAttributes,
      ZoomAndPanSVGAttributes,
      PresentationSVGAttributes {
      version?: string;
      baseProfile?: string;
      x?: number | string;
      y?: number | string;
      width?: number | string;
      height?: number | string;
      contentScriptType?: string;
      contentStyleType?: string;
      xmlns?: string;
      "xmlns:xlink"?: string;
    }

    interface UseSVGAttributes<T>
      extends GraphicsElementSVGAttributes<T>,
      ConditionalProcessingSVGAttributes,
      ExternalResourceSVGAttributes,
      StylableSVGAttributes,
      TransformableSVGAttributes {
      x?: number | string;
      y?: number | string;
      width?: number | string;
      height?: number | string;
      href?: string;
      fill?: string;
      "xlink:href"?: string;
    }
  }
}
