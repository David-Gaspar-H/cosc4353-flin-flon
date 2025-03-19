import React from "react";
// import ResponsiveAppBar from "./ResponsiveAppBar";
import Footer from "./Footer";
import { Grid2, Paper } from "@mui/material";
import FormTable from "./FormTable";

const UserForms = () => {
	const userForms = [
		{
			formName: "Reduce Course Load",
			dateSubmitted: "2025-03-15",
			status: "Rejected",
			firstName: "John",
			lastName: "Doe",
		},
		{
			formName: "Reduce Course Load",
			dateSubmitted: "2025-03-11",
			status: "Pending",
			firstName: "Jane",
			lastName: "Doe",
		},
		{
			formName: "FERPA",
			dateSubmitted: "2025-03-10",
			status: "Approved",
			firstName: "Jane",
			lastName: "Smith",
		},
	];
	return (
		<>
			{/* <ResponsiveAppBar /> */}

			<Grid2 container direction={"column"} sx={{ height: "100vh" }}>
				<Paper
					sx={{
						flex: 1,
						marginBottom: "10px",
						backgroundColor: "#f5f5f5",
					}}
				>
					<FormTable
						isAdmin={false}
						formsData={userForms}
					></FormTable>
				</Paper>
			</Grid2>

			<Footer />
		</>
	);
};

export default UserForms;
