import React, { useState } from "react";
import {
	FormControl,
	TextField,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Paper,
	Typography,
	Grid2,
} from "@mui/material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState({
		firstName: "",
		lastName: "",
		email: "",
		username: "",
		password: "",
		confirmPassword: "",
		type: "",
	});

	const [error, setError] = useState("");

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUser({
			...user,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (user.password !== user.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			const response = await api.post(
				"/users/",
				{
					first_name: user.firstName,
					last_name: user.lastName,
					email: user.email,
					username: user.username,
					password: user.password,
					role: user.type,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			console.log("Registration successful:", response.data);
			navigate("/login");
		} catch (error) {
			console.error("Registration failed:", error);
			setError(
				error.response?.data?.message ||
					"Registration failed. Please try again."
			);
		}
	};

	return (
		<Grid2
			container
			justifyContent="center"
			alignItems="center"
			sx={{ height: "100vh" }}
		>
			<Paper sx={{ width: "500px", padding: 3 }}>
				<Typography variant="h4" gutterBottom>
					Register User
				</Typography>
				<form onSubmit={handleSubmit}>
					<FormControl fullWidth margin={"normal"}>
						<TextField
							label="First Name"
							variant="outlined"
							fullWidth
							margin="normal"
							name="firstName"
							value={user.firstName}
							onChange={handleInputChange}
							required
						/>
						<TextField
							label="Last Name"
							variant="outlined"
							fullWidth
							margin="normal"
							name="lastName"
							value={user.lastName}
							onChange={handleInputChange}
							required
						/>
						<TextField
							label="Email"
							variant="outlined"
							fullWidth
							margin="normal"
							name="email"
							type="email"
							value={user.email}
							onChange={handleInputChange}
							required
						/>
						<TextField
							label="Username"
							variant="outlined"
							fullWidth
							margin="normal"
							name="username"
							value={user.username}
							onChange={handleInputChange}
							required
						/>
						<FormControl fullWidth margin="normal">
							<InputLabel id="type-select-label">
								User Type
							</InputLabel>
							<Select
								labelId="type-select-label"
								id="type-select"
								value={user.type}
								label="User Type"
								name="type"
								onChange={handleInputChange}
								required
							>
								<MenuItem value="user">User</MenuItem>
								<MenuItem value="admin">Admin</MenuItem>
							</Select>
						</FormControl>
						<TextField
							label="Password"
							variant="outlined"
							fullWidth
							margin="normal"
							name="password"
							type="password"
							value={user.password}
							onChange={handleInputChange}
							required
						/>
						<TextField
							label="Re-enter Password"
							variant="outlined"
							fullWidth
							margin="normal"
							name="confirmPassword"
							type="password"
							value={user.confirmPassword}
							onChange={handleInputChange}
							required
						/>
						{error && (
							<Typography color="error" sx={{ mt: 2 }}>
								{error}
							</Typography>
						)}
						<Button
							variant="contained"
							type="submit"
							sx={{ marginTop: 2, width: "auto" }}
						>
							Submit
						</Button>
					</FormControl>
				</form>
			</Paper>
		</Grid2>
	);
};

export default Register;
