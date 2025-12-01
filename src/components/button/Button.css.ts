import { style, styleVariants } from "@vanilla-extract/css";
import { tokens, themeContract } from "../../themes/themes.css";

// 基础按钮样式
export const buttonBase = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: tokens.spacing.sm,
	fontFamily: tokens.fontFamily.system,
	fontWeight: tokens.fontWeight.medium,
	border: "none",
	cursor: "pointer",
	transition: "all 0.2s ease",
	position: "relative",
	minHeight: "48px",
	minWidth: "48px",

	":disabled": {
		opacity: 0.5,
		cursor: "not-allowed",
		pointerEvents: "none",
	},

	// selectors: {
	// 	"&:active:not(:disabled)": {
	// 		transform: "scale(0.98)",
	// 	},
	// },
});

// 按钮变体
export const buttonVariant = styleVariants({
	primary: {
		backgroundColor: themeContract.color.primary,
		color: "#ffffff",
		boxShadow: `
    inset 1px 1px 0 ${themeContract.color.primaryShadowLight},
    inset -1px -1px 0 ${themeContract.color.primaryShadowDark},
    ${themeContract.color.primaryShadowLight} -2px -2px 4px,
    ${themeContract.color.primaryShadowDark} 3px 3px 8px
  `,

		selectors: {
			"&:active:not(:disabled)": {
				boxShadow: `
    inset ${themeContract.color.primaryShadowDark} 3px 3px 6px,
    inset ${themeContract.color.primaryShadowLight} -3px -3px 6px
  `,
				transform: "translateY(2px)",
			},
		},
	},

	secondary: {
		backgroundColor: themeContract.color.surface,
		color: themeContract.color.foreground,
		boxShadow: `${themeContract.color.shadowLight} -2px -2px 4px, ${themeContract.color.shadowDark} 3px 3px 8px`,

		selectors: {
			"&:active:not(:disabled)": {
				boxShadow: `inset ${themeContract.color.shadowDark} 3px 3px 6px, inset ${themeContract.color.shadowLight} -3px -3px 6px`,
				transform: "translateY(2px)",
			},
		},
	},

	danger: {
		background: themeContract.color.error,
		color: "#fff",
		boxShadow: `
    inset 1px 1px 0 ${themeContract.color.errorShadowLight},
    inset -1px -1px 0 ${themeContract.color.errorShadowDark},
    ${themeContract.color.errorShadowLight} -2px -2px 4px,
    ${themeContract.color.errorShadowDark} 3px 3px 8px
  `,

		selectors: {
			"&:active:not(:disabled)": {
				boxShadow: `
    inset ${themeContract.color.errorShadowDark} 3px 3px 6px,
    inset ${themeContract.color.errorShadowLight} -3px -3px 6px
  `,
				transform: "translateY(2px)",
			},
		},
	},

	text: {
		background: "transparent",
		color: themeContract.color.primary,
		boxShadow: "none",
		textShadow: `${themeContract.color.shadowLight} -1px -1px 2px, ${themeContract.color.shadowDark} 1px 1px 2px`,
		border: "none",

		selectors: {
			"&:active:not(:disabled)": {
				textShadow: `${themeContract.color.shadowDark} 1px 1px 3px, ${themeContract.color.shadowLight} -1px -1px 1px`,
				transform: "translateY(2px)",
			},
		},
	},
});

// 按钮尺寸
export const buttonSize = styleVariants({
	sm: {
		padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
		fontSize: "14px",
		minHeight: "36px",
	},
	md: {
		padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
		fontSize: "16px",
		minHeight: "48px",
	},
	lg: {
		padding: `${tokens.spacing.lg} ${tokens.spacing.xxl}`,
		fontSize: "18px",
		minHeight: "56px",
	},
});

// 按钮形状
export const buttonShape = styleVariants({
	circle: { borderRadius: tokens.radius.full },
	rounded: { borderRadius: tokens.radius.md },
	square: { borderRadius: tokens.radius.none },
});

// 图标按钮
export const iconOnly = style({
	padding: tokens.spacing.md,

	selectors: {
		[`${buttonSize.sm}.&`]: {
			padding: tokens.spacing.sm,	minHeight: "32px",
	minWidth: "32px",
			width: "32px",
			height: "32px",
		},

		[`${buttonSize.md}.&`]: {
			padding: tokens.spacing.md,
			width: "48px",
			height: "48px",
		},

		[`${buttonSize.lg}.&`]: {
			padding: tokens.spacing.lg,
			width: "56px",
			height: "56px",
		},
	},
});