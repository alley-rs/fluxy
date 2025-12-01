import {
	assignVars,
	createGlobalTheme,
	createThemeContract,
} from "@vanilla-extract/css";

// 设计令牌 (全局)
export const tokens = createGlobalTheme(":root", {
	borderWidth: {
		none: "0",
		sm: "1px",
		md: "2px",
		lg: "4px",
	},
	spacing: {
		xs: "4px",
		sm: "8px",
		md: "16px",
		lg: "24px",
		xl: "32px",
		xxl: "48px",
	},
	radius: {
		none: "0",
		sm: "4px",
		md: "8px",
		lg: "12px",
		full: "9999px",
	},
	fontSize: {
		xs: "12px",
		sm: "14px",
		md: "16px",
		lg: "18px",
		xl: "24px",
	},
	fontWeight: {
		normal: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
	},
	fontFamily: {
		system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	},
	opacity: "0.94",
});

export const themeContract = createThemeContract({
	color: {
		background: null,
		surface: null,
		foreground: null,

		primary: null,

		secondary: null,
		secondaryLight: null,
		secondaryDark: null,

		success: null,
		warning: null,
		error: null,

		shadowLight: null,
		shadowDark: null,

		primaryShadowLight: null,
		primaryShadowDark: null,

		errorShadowLight: null,
		errorShadowDark: null,
	},
});

// 主题颜色变量
export const lightThemeVars = {
	color: {
		background: "rgba(232, 236, 240, 0.8)",
		surface: "#e8ecf0",
		foreground: "#2d3748",

		primary: "#4299e1",

		primaryShadowLight: "rgba(105, 179, 231, 0.4)",
		primaryShadowDark: "rgba(53, 123, 180, 0.5)",

		secondary: "#718096",
		secondaryLight: "#b0bec5",
		secondaryDark: "#7f8c8d",

		success: "#48bb78",
		warning: "#f39c12",

		error: "#f56565",

		errorShadowLight: "rgba(247, 134, 134, 0.4)",
		errorShadowDark: "rgba(196, 81, 81, 0.5)",

		shadowLight: "rgba(255, 255, 255, 0.9)",
		shadowDark: "rgba(163, 177, 198, 0.6)",
	},
};

export const darkThemeVars = {
	color: {
		background: "rgba(26, 29, 35, 0.8)",
		surface: "#1a202c",
		foreground: "#e4e6eb",

		primary: "#4f8fbe",

		primaryShadowLight: "rgba(255, 255, 255, 0.05)",
		primaryShadowDark: "rgba(0, 0, 0, 0.5)",

		secondary: "#7f8c8d",
		secondaryLight: "#95a5a6",
		secondaryDark: "#566573",

		success: "#2ecc71",
		warning: "#f1c40f",
		error: "#ca6767",

		errorShadowLight: "rgba(255, 255, 255, 0.05)",
		errorShadowDark: "rgba(0, 0, 0, 0.5)",

		shadowLight: "rgba(255, 255, 255, 0.05)",
		shadowDark: "rgba(0, 0, 0, 0.5)",
	},
};

export const brandThemeVars = {
	color: {
		background: "#f0e6ff",
		surface: "#f0e6ff",
		foreground: "#2d3748",

		primary: "#805ad5",

		secondary: "#a5b4fc",
		secondaryLight: "#c7d2fe",
		secondaryDark: "#818cf8",

		success: "#48bb78",
		warning: "#f59e0b",
		error: "#f56565",

		errorShadowLight: "rgba(247, 134, 134, 0.4)",
		errorShadowDark: "rgba(196, 81, 81, 0.5)",

		shadowLight: "rgba(255, 255, 255, 0.8)",
		shadowDark: "rgba(128, 90, 213, 0.3)",

		primaryShadowLight: "rgba(153, 122, 220, 0.4)",
		primaryShadowDark: "rgba(102, 72, 171, 0.5)",
	},
};

export const lightTheme = assignVars(themeContract, lightThemeVars);
export const darkTheme = assignVars(themeContract, darkThemeVars);
export const brandTheme = assignVars(themeContract, brandThemeVars);
