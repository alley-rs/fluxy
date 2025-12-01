import { createEffect, type Accessor } from "solid-js";

export function useTheme(themeID: Accessor<"light" | "dark">) {
	createEffect(() => {
		document.documentElement.setAttribute("data-theme", themeID() ?? "light");
	});
}
