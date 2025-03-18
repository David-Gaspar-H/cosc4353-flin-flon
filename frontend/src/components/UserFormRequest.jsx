import React, { useState } from "react";
import ResponsiveAppBar from "./ResponsiveAppBar";
import Footer from "./Footer";
import {
	Grid2,
	Paper,
	Typography,
	Box,
	Button,
	Card,
	CardContent,
} from "@mui/material";
import ReduceCourseLoadForm from "./ReduceCourseLoadForm";
import FerpaForm from "./FerpaForm";

const UserFormRequest = () => {
	const [openForm, setOpenForm] = useState(null);

	const handleFormClick = (formName) => {
		setOpenForm(formName);
	};

	const renderForm = () => {
		switch (openForm) {
			case "Reduce Course Load":
				return <ReduceCourseLoadForm />;
			case "FERPA":
				return <FerpaForm />;
			// default:
			// 	return (
			// 		<Typography variant="body1">
			// 			Select a form to begin.
			// 		</Typography>
			// 	);
		}
	};

	return (
		<>
			<ResponsiveAppBar />
			<Grid2
				container
				direction={"column"}
				sx={{ height: "100vh", padding: 2 }}
			>
				<Paper sx={{ flex: 1, p: 3 }}>
					<Typography variant="h4" sx={{ mb: 3 }} align="center">
						Available Forms
					</Typography>

					<Typography variant="h6" pl={25} pb={5}>
						Select a form to begin.
					</Typography>

					{/* Form Cards */}
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							gap: 3,
							justifyContent: "center",
							mb: 4, // Added bottom margin to prevent overlap with footer
						}}
					>
						<Card
							sx={{
								width: "500px",
								boxShadow: 5, // Increased shadow for better visibility
								borderRadius: 2,
								padding: 2, // Added padding inside the card
							}}
						>
							<CardContent>
								<Typography variant="h6" align="center">
									Reduce Course Load
								</Typography>
								<Button
									variant="contained"
									fullWidth
									sx={{ mt: 2 }}
									onClick={() =>
										handleFormClick("Reduce Course Load")
									}
								>
									Fill out Form
								</Button>
							</CardContent>
						</Card>

						<Card
							sx={{
								width: "500px",
								boxShadow: 5, // Increased shadow for better visibility
								borderRadius: 2,
								padding: 2, // Added padding inside the card
							}}
						>
							<CardContent>
								<Typography variant="h6" align="center">
									FERPA
								</Typography>
								<Button
									variant="contained"
									fullWidth
									sx={{ mt: 2 }}
									onClick={() => handleFormClick("FERPA")}
								>
									Fill out Form
								</Button>
							</CardContent>
						</Card>
					</Box>

					{/* Render the selected form */}
					<Box sx={{ mt: 4, minHeight: "300px" }}>{renderForm()}</Box>
				</Paper>
			</Grid2>
			<Footer />
		</>
	);
};

export default UserFormRequest;
