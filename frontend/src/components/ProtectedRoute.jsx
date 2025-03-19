import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { Box, CircularProgress, Typography } from "@mui/material";

const Header = ({ title, subtitle }) => (
	<Box>
		<Typography variant="h4">{title}</Typography>
		<Typography variant="subtitle1">{subtitle}</Typography>
	</Box>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { user } = useUser();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(user === undefined);
	}, [user]);

	// Show loading indicator
	if (isLoading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	// Redirect to login if no user
	if (!user) {
		return <Navigate to="/login" />;
	}

	// Check if user has required role
	if (allowedRoles && !allowedRoles.includes(user.role)) {
		return (
			<Box m="20px">
				<Header
					title="Access Denied"
					subtitle="You do not have permission to view this page."
				/>
				<p>
					Warning: ({user.role})s are not allowed access to this page.
					Any attempt at unauthorized access will be kept note of ⚠️
				</p>
			</Box>
		);
	}

	// If all checks pass, render the protected content
	return children;
};

export default ProtectedRoute;
