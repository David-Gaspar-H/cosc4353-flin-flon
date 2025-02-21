import { useState } from "react";
import { TextField, Button, Typography, Grid2, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const response = await api.post("/login/", {
				username: username,
				password: password,
			});

			console.log("User Info:", response.data.user.role);
			if (response.data.user.role !== "admin") {
				navigate("/");
			} else {
				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const handleRegister = () => {
		navigate("/register");
	};

	return (
		<Grid2
			container
			justifyContent="center"
			alignItems="center"
			sx={{ height: "100vh" }}
		>
			<Paper
				sx={{
					padding: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: 300,
				}}
			>
				<Typography
					variant="h5"
					sx={{ marginBottom: 2, fontWeight: 600 }}
				>
					Login
				</Typography>

				<form onSubmit={handleLogin}>
					<TextField
						label="Username"
						type="username"
						variant="outlined"
						fullWidth
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						sx={{ marginBottom: 2 }}
						required
					/>

					<TextField
						label="Password"
						type="password"
						variant="outlined"
						fullWidth
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						sx={{ marginBottom: 2 }}
						required
					/>

					<Button
						variant="contained"
						color="primary"
						type="submit"
						fullWidth
						sx={{ marginTop: 2 }}
					>
						Login
					</Button>
				</form>

				<Grid2 container justifyContent="center" sx={{ marginTop: 2 }}>
					<Button
						color="secondary"
						onClick={handleRegister}
						sx={{ textTransform: "none" }}
					>
						Register
					</Button>
				</Grid2>
			</Paper>
		</Grid2>
	);
};

export default Login;
