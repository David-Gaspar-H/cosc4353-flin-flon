import React from "react";
import ResponsiveAppBar from "./ResponsiveAppBar";
import Footer from "./Footer";
import { Grid2, Paper } from "@mui/material";
import ReduceCourseLoadForm from "./ReduceCourseLoadForm";
import FerpaForm from "./FerpaForm";
import FormsTable from "./FormsTable";

const UserFormRequest = () => {
	return (
		<>
			<ResponsiveAppBar />

			<Grid2>
				<Paper>
					<FormsTable></FormsTable>
				</Paper>
			</Grid2>

			<Footer />
		</>
	);
};

export default UserFormRequest;
