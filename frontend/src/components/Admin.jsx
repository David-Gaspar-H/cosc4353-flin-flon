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
import {useNavigate} from "react-router-dom";

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
		<Box
			sx={{
				padding: 4,
				backgroundColor: "transparent",
				boxShadow: "none",
			}}
		>
			<Typography variant="h4" align="left" gutterBottom ml={2}>
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
	const navigate = useNavigate();
	const [session, setSession] = React.useState({
		user: {
			name: "John Doe",
			email: "johndoe@outlook.com",
			image: "https://avatars.githubusercontent.com/u/1955046",
		},
	});

	const authentication = React.useMemo(() => {
		return {
			signIn: () => {
				setSession({
					user: {
						name: "John Doe",
						email: "johndow@outlook.com",
						image: "https://avatars.githubusercontent.com/u/1955046",
					},
				});
			},
			signOut: () => {
				setSession(null);
				navigate('/');
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
				sx={{ backgroundColor: "transparent" }}
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
