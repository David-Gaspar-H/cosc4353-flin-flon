import { useState } from "react";
import { TextField, Button, Typography, Grid2, Paper } from "@mui/material";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = (e) => {
		e.preventDefault();
	};

	const handleForgotPassword = () => {};

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
						label="Email Address"
						type="email"
						variant="outlined"
						fullWidth
						value={email}
						onChange={(e) => setEmail(e.target.value)}
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
						onClick={handleForgotPassword}
						sx={{ textTransform: "none" }}
					>
						Forgot Password?
					</Button>
				</Grid2>
			</Paper>
		</Grid2>
	);
};

export default Login;
