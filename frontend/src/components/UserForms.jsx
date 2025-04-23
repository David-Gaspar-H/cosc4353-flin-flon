import React, { useState, useEffect } from "react";
import {
	Grid2,
	Paper,
	Typography,
	Box,
	Card,
	CardContent,
	Button,
} from "@mui/material";
import FormTable from "./FormTable";
import api from "../services/api";
import { useUser } from "./context/UserContext";
import { useNavigate } from "react-router-dom";

const UserForms = () => {
	const [userForms, setUserForms] = useState([]);
	const { user } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchForms = async () => {
			if (!user) return;
			try {
				const response = await api.get(`/users/${user.id}`);
				setUserForms(response.data.forms);
			} catch (error) {
				console.error("Error fetching user forms:", error);
				setUserForms([]); // fallback for error
			}
		};

		fetchForms();
	}, [user]);

	return (
		<Grid2
			container
			direction="column"
			sx={{ height: "100vh", px: 4, pt: 4 }}
		>
			<Paper
				sx={{
					flex: 1,
					marginBottom: "10px",
					backgroundColor: "#f5f5f5",
					padding: 3,
				}}
			>
				{userForms.length === 0 ? (
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						height="100%"
					>
						<Card
							sx={{
								maxWidth: 500,
								width: "100%",
								textAlign: "center",
								boxShadow: 3,
								borderRadius: 3,
								backgroundColor: "#ffffff",
							}}
						>
							<CardContent>
								<Typography variant="h5" gutterBottom>
									You don’t have any forms yet
								</Typography>
								<Typography
									variant="body1"
									color="text.secondary"
									sx={{ mb: 3 }}
								>
									Submit your first form to get started!
								</Typography>
								<Button
									variant="contained"
									color="primary"
									onClick={() => navigate("/form-request")}
								>
									Submit a Form
								</Button>
							</CardContent>
						</Card>
					</Box>
				) : (
					<FormTable isAdmin={false} formsData={userForms} />
				)}
			</Paper>
		</Grid2>
	);
};

export default UserForms;
