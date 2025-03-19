import { useState } from "react";
import {
	TextField,
	Button,
	Typography,
	Grid2,
	Paper,
	Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Microsoft } from "@mui/icons-material";
import { useUser } from "./context/UserContext";

const Login = () => {
	const { login } = useUser();
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

			// Store user data in context for user sessions
			login(response.data.user);

			// Handle redirect after login
			if (response.data.user.role !== "admin") {
				navigate("/");
			} else {
				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const handleMicrosoftLogin = async () => {
		try {
			const response = await api.get("/ms-auth/");
			window.location.href = response.data.auth_url;
		} catch (error) {
			console.error("Microsoft login failed:", error);
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

				<form onSubmit={handleLogin} style={{ width: "100%" }}>
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

				<Divider sx={{ width: "100%", my: 2 }}>OR</Divider>

				<Button
					variant="outlined"
					fullWidth
					startIcon={<Microsoft />}
					onClick={handleMicrosoftLogin}
					sx={{
						color: "#5E5E5E",
						borderColor: "#5E5E5E",
						"&:hover": {
							borderColor: "#5E5E5E",
							backgroundColor: "rgba(94, 94, 94, 0.04)",
						},
					}}
				>
					Sign in with Microsoft
				</Button>

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
