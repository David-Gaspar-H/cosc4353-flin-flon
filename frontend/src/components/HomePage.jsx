import React from "react";
import { useUser } from "./context/UserContext";
import { Box, Typography, Button, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const { user } = useUser();
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "80vh",
				bgcolor: "#f5f5f5",
				p: 4,
			}}
		>
			<Box
				sx={{
					bgcolor: "white",
					boxShadow: 3,
					borderRadius: 4,
					p: 5,
					maxWidth: 800,
					width: "100%",
				}}
			>
				<Typography variant="h4" fontWeight={600} gutterBottom>
					Welcome, {user.first_name}!
				</Typography>

				<Typography
					variant="body1"
					color="text.secondary"
					sx={{ mb: 4 }}
				>
					You're part of the{" "}
					<strong>{user.unit?.name || "University Community"}</strong>
					. Use the options below to manage your forms and track
					progress.
				</Typography>

				<Grid2 container spacing={2}>
					<Grid2 item xs={12} sm={6}>
						<Button
							variant="contained"
							fullWidth
							size="large"
							onClick={() => navigate("/form-request")}
						>
							Submit New Form
						</Button>
					</Grid2>
					<Grid2 item xs={12} sm={6}>
						<Button
							variant="outlined"
							fullWidth
							size="large"
							onClick={() => navigate("/my-forms")}
						>
							View My Forms
						</Button>
					</Grid2>
				</Grid2>
			</Box>
		</Box>
	);
};

export default HomePage;
