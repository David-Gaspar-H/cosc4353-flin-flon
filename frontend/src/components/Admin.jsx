import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AccountCircleSharp from "@mui/icons-material/AccountCircleSharp";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import UserTable from "./UserTable";

const demoTheme = createTheme({
	cssVariables: {
		colorSchemeSelector: "data-toolpad-color-scheme",
	},
	colorSchemes: { light: true, dark: true },
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 600,
			lg: 1200,
			xl: 1536,
		},
	},
});

function DemoPageContent({ pathname }) {
	return (
		// <Box
		// 	sx={{
		// 		py: 4,
		// 		display: "flex",
		// 		flexDirection: "column",
		// 		alignItems: "center",
		// 		textAlign: "center",
		// 	}}
		// >
		// 	<Typography>Dashboard content for {pathname}</Typography>
		// </Box>
		<Box
			sx={{
				padding: 4,
			}}
		>
			<Typography variant="h4" align="left" gutterBottom>
				Users
			</Typography>
			<UserTable />
		</Box>
	);
}

DemoPageContent.propTypes = {
	pathname: PropTypes.string.isRequired,
};

function Admin(props) {
	const { window } = props;

	const [session, setSession] = React.useState({
		user: {
			name: "Bharat Kashyap",
			email: "bharatkashyap@outlook.com",
			image: "https://avatars.githubusercontent.com/u/19550456",
		},
	});

	const authentication = React.useMemo(() => {
		return {
			signIn: () => {
				setSession({
					user: {
						name: "Bharat Kashyap",
						email: "bharatkashyap@outlook.com",
						image: "https://avatars.githubusercontent.com/u/19550456",
					},
				});
			},
			signOut: () => {
				setSession(null);
			},
		};
	}, []);

	const router = useDemoRouter("/dashboard");

	// Remove this const when copying and pasting into your project.
	const demoWindow = window !== undefined ? window() : undefined;

	function CustomTitle() {
		return (
			<Stack direction="row" alignItems="center" spacing={2}>
				<AccountCircleSharp fontSize="large" color="primary" />
				<Typography variant="h6">User Management</Typography>
			</Stack>
		);
	}

	return (
		// preview-start
		<AppProvider
			session={session}
			authentication={authentication}
			router={router}
			theme={demoTheme}
			window={demoWindow}
		>
			<DashboardLayout
				slots={{
					appTitle: CustomTitle,
				}}
				hideNavigation
			>
				<DemoPageContent pathname={router.pathname} />
			</DashboardLayout>
		</AppProvider>
	);
}

export default Admin;
