import { style, styleVariants } from "@vanilla-extract/css";
import { tokens, themeContract } from "../../themes/themes.css";

export const badgeWrapper = style({
	position: "relative",
	display: "inline-flex",
	verticalAlign: "middle",
	flexShrink: 0,
});

export const badgeBase = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	fontFamily: tokens.fontFamily.system,
	fontWeight: tokens.fontWeight.bold,
	borderRadius: tokens.radius.full,
	color: "#fff",
	zIndex: 10,
	transition: "all 0.2s ease",
	boxShadow: `1px 1px 3px ${themeContract.color.shadowDark}`,
	border: `1px solid ${themeContract.color.surface}`, // Border to separate from parent
});

export const badgePosition = style({
	position: "absolute",
	top: 0,
	right: 0,
	transform: "translate(50%, -50%)",
	transformOrigin: "100% 0%",
});

export const badgeSize = styleVariants({
	sm: {
		height: "16px",
		minWidth: "16px",
		padding: "0 4px",
		fontSize: "10px",
	},
	md: {
		height: "20px",
		minWidth: "20px",
		padding: "0 6px",
		fontSize: "12px",
	},
});

export const badgeDot = style({
	height: "8px",
	width: "8px",
	minWidth: "8px",
	padding: 0,
	borderRadius: "50%",
});

export const badgeVariant = styleVariants({
	primary: { backgroundColor: themeContract.color.primary },
	success: { backgroundColor: themeContract.color.success },
	warning: { backgroundColor: themeContract.color.warning },
	error: { backgroundColor: themeContract.color.error },
});
