// ##############################
// // // Header styles
// #############################

import {
	container,
	// defaultFont,
	primaryColor,
	defaultBoxShadow,
	infoColor,
	successColor,
	warningColor,
	dangerColor
} from "assets/jss/material-dashboard-react.js";

const headerStyle = theme => ({
	appBar: {
		backgroundColor: "#003333",
		color: "#FFFFFF",
		boxShadow: "none",
		borderBottom: "0",
		marginBottom: "0",
		position: 'fixed',
		padding: "0 !important",
		[theme.breakpoints.up('lg')]: {
			left: 260,
		    width: "calc(100vw - 260px)",
		},
		[theme.breakpoints.down('xs')]: {
			height: 48
		},
		height: "70px",
		zIndex: "1029",
		border: "0",
		transition: "all 150ms ease 0s",
		minHeight: "48px",
		display: "block",
		// position: "sticky",
		// [theme.breakpoints.up("lg")]: {
		// 	width: 'calc(100% - 260px)'
		// }
		
	},
	container: {
		...container,
		height: "100%",
		minHeight: "50px",
	},
	flex: {
		flex: 1,
		// whiteSpace: 'nowrap'
	},
	goBackButton: {
		color: "inherit",
		background: "transparent",
		boxShadow: "none",
		"&:hover,&:focus": {
			background: "transparent"
		},
		width: 50,
		height: 50
	},
	title: {
		maxWidth: "calc(100vw - 130px)",
		// ...defaultFont,
		fontWeight: 500,
		[theme.breakpoints.down('sm')]: {
			fontSize: "1rem",
		},
		lineHeight: "1.16667em",
		fontSize: "1.3125rem",
		borderRadius: "3px",
		textTransform: "none",
		color: "inherit",
		"&:hover,&:focus": {
			background: "transparent"
		}
	},
	appResponsive: {
		// top: "8px",
	},
	primary: {
		backgroundColor: primaryColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	info: {
		backgroundColor: infoColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	success: {
		backgroundColor: successColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	warning: {
		backgroundColor: warningColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	danger: {
		backgroundColor: dangerColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	}
});

export default headerStyle;
