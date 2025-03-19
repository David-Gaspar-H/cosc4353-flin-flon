import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import UserTable from "./UserTable";

function UserManagement() {
	return (
		<Box
			sx={{
				padding: 4,
				backgroundColor: "transparent",
				boxShadow: "none",
			}}
		>
			<Typography variant="h4" align="left" gutterBottom ml={2}>
				User Management
			</Typography>
			<UserTable />
		</Box>
	);
}

export default UserManagement;
