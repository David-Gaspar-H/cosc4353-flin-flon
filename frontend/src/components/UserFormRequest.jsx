import React, { useState } from "react";
import Footer from "./Footer";
import {
	Grid2,
	Paper,
	Typography,
	Box,
	Button,
	Card,
	CardContent,
	Container,
} from "@mui/material";
import ReduceCourseLoadForm from "./ReduceCourseLoadForm";
import FerpaForm from "./FerpaForm";

const UserFormRequest = () => {
	const [openForm, setOpenForm] = useState(null);

	const handleFormClick = (formName) => {
		setOpenForm(formName);
		// Scroll to top when form is opened
		window.scrollTo(0, 0);
	};

	const renderForm = () => {
		switch (openForm) {
			case "Reduce Course Load":
				return <ReduceCourseLoadForm />;
			case "FERPA":
				return <FerpaForm />;
			default:
				return null;
		}
	};

	return (
		<Box>
			<Container
				maxWidth={false}
				sx={{ width: "95%", maxWidth: "1400px", py: 2 }}
			>
				<Paper
					sx={{
						p: 3,
						width: "100%",
						display: "flex",
						flexDirection: "column",
						minHeight: "90vh",
						position: "relative",
						overflow: "hidden", // Prevents content from spilling outside
					}}
				>
					<Typography variant="h4" sx={{ mb: 3 }} align="center">
						Available Forms
					</Typography>

					<Typography
						variant="h6"
						sx={{ mb: 5, textAlign: "center" }}
					>
						Select a form to begin.
					</Typography>

					{/* Form Cards */}
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", md: "row" },
							gap: 3,
							justifyContent: "center",
							mb: 4,
						}}
					>
						<Card
							sx={{
								width: { xs: "100%", md: "500px" },
								boxShadow: 5,
								borderRadius: 2,
								padding: 2,
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
								width: { xs: "100%", md: "500px" },
								boxShadow: 5,
								borderRadius: 2,
								padding: 2,
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

					{/* Form Content with Fixed Height and Scrolling */}
					{openForm && (
						<Box
							sx={{
								mt: 4,
								mb: 4,
								maxHeight: "90vh",
								overflowY: "auto",
								border: "1px solid #e0e0e0",
								borderRadius: 1,
								p: 2,
							}}
						>
							{renderForm()}
						</Box>
					)}

					{/* Show the form section only when a form is selected */}
					{!openForm && <Box sx={{ flexGrow: 1 }} />}
				</Paper>
			</Container>
		</Box>
	);
};

export default UserFormRequest;
