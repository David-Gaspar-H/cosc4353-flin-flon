import React from "react";
import { Grid2, Paper } from "@mui/material";
// import ResponsiveAppBar from "./ResponsiveAppBar";
import Footer from "./Footer";
import FormTable from "./FormTable";

const AdminFormApproval = () => {
	const adminForms = [
		{
			formName: "Reduce Course Load",
			firstName: "John",
			lastName: "Doe",
			dateSubmitted: "2025-03-12",
			needsAnotherRequestor: true,
		},
		{
			formName: "FERPA",
			firstName: "Jane",
			lastName: "Smith",
			dateSubmitted: "2025-03-14",
			needsAnotherRequestor: false,
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
						isAdmin={true}
						formsData={adminForms}
						sx={{ pt: 6 }}
					></FormTable>
				</Paper>
			</Grid2>
			<Footer />
		</>
	);
};

export default AdminFormApproval;
