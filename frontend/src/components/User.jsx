import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const UserForm = ({ clearSelection, isCreating, selectedUser }) => {
	const [user, setUserData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		username: "",
		password: "",
		role: "user",
		status: "active",
	});
	const navigate = useNavigate();

	useEffect(() => {
		if (selectedUser) {
			setUserData({
				first_name: selectedUser.first_name,
				last_name: selectedUser.last_name,
				email: selectedUser.email,
				username: selectedUser.username,
				password: "",
				role: selectedUser.role,
				status: selectedUser.status,
			});
		}
	}, [selectedUser]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserData({
			...user,
			[name]: value,
		});
	};

	const handleSubmit = async () => {
		try {
			if (isCreating) {
				// Create new user
				await api.post("/users/", {
					first_name: user.first_name,
					last_name: user.last_name,
					email: user.email,
					username: user.username,
					password: user.password,
					role: user.role,
					status: user.status,
				});
			} else {
				if (!selectedUser || !selectedUser.id) {
					console.error("No user selected for update.");
					return;
				}

				// Update existing user
				await api.put(`/users/${selectedUser.id}/`, {
					first_name: user.first_name,
					last_name: user.last_name,
					email: user.email,
					username: user.username,
					...(user.password && { password: user.password }),
					role: user.role,
					status: user.status,
				});
			}

			clearSelection(); // Clear the selection in parent
			navigate("/dashboard");
		} catch (error) {
			console.error("Error saving user:", error);
		}
	};

	return (
		<Grid2
			container
			justifyContent="center"
			alignItems="center"
			sx={{ height: '100vh', overflow: 'auto'}}
			
		>
			<Paper sx={{ width: "500px", padding: 3}}>
				<Typography variant="h4" gutterBottom>
					{isCreating ? "Create User" : "Edit User"}
				</Typography>
				<FormControl fullWidth margin={"normal"}>
					<TextField
						label="First Name"
						variant="outlined"
						fullWidth
						margin="normal"
						name="first_name"
						value={user.first_name}
						onChange={handleInputChange}
					/>
					<TextField
						label="Last Name"
						variant="outlined"
						fullWidth
						margin="normal"
						name="last_name"
						value={user.last_name}
						onChange={handleInputChange}
					/>
					<TextField
						label="Email"
						variant="outlined"
						fullWidth
						margin="normal"
						name="email"
						value={user.email}
						onChange={handleInputChange}
					/>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						margin="normal"
						name="username"
						value={user.username}
						onChange={handleInputChange}
					/>
					<TextField
						label="Password"
						variant="outlined"
						fullWidth
						margin="normal"
						name="password"
						type="password"
						value={user.password}
						onChange={handleInputChange}
					/>
					<FormControl fullWidth margin={"normal"}>
						<InputLabel id="role-label">Role</InputLabel>
						<Select
							labelId="role-label"
							id="role"
							name="role"
							value={user.role}
							label="Role"
							onChange={handleInputChange}
						>
							<MenuItem value="admin">Admin</MenuItem>
							<MenuItem value="user">User</MenuItem>
						</Select>
					</FormControl>
					<FormControl fullWidth margin={"normal"}>
						<InputLabel id="status-label">Status</InputLabel>
						<Select
							labelId="status-label"
							id="status"
							name="status"
							value={user.status}
							label="Status"
							onChange={handleInputChange}
						>
							<MenuItem value="active">Active</MenuItem>
							<MenuItem value="deactivated">Deactivated</MenuItem>
						</Select>
					</FormControl>
					<Button
						variant="contained"
						onClick={handleSubmit}
						sx={{ marginTop: 2, width: "auto" }}
					>
						{isCreating ? "Create" : "Update"}
					</Button>
				</FormControl>
			</Paper>
		</Grid2>
	);
};

export default UserForm;
