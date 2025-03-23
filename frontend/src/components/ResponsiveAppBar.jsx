import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

const user_pages = [
	{ name: "Home", path: "/" },
	{ name: "Form Request", path: "/form-request" },
	{ name: "My Forms", path: "/my-forms" },
	{ name: "About Us", path: "/about" },
];

const admin_pages = [
	{ name: "Users", path: "/dashboard" },
	{ name: "Approvals", path: "/form-approval" },
	{ name: "Pending Forms", path: "/admin-form" },
];

function ResponsiveAppBar({ user, logout }) {
	// Get user details from user session
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const navigate = useNavigate();

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleLogin = () => {
		navigate("/login");
		handleCloseUserMenu();
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
		handleCloseUserMenu();
	};

	const pages = user?.role === "admin" ? admin_pages : user_pages;

	return (
		<AppBar
			position="static"
			sx={{ backgroundColor: "#2f4454", boxShadow: "none" }}
		>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<img
						src="/cube.png"
						alt="Flin Flon"
						style={{
							md: "flex",
							marginRight: "8px",
							width: "40px",
							height: "40px",
							objectFit: "contain",
						}}
					/>
					<Typography
						variant="h6"
						noWrap
						component="a"
						sx={{
							mr: 2,
							ml: 1,
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						FlinFlon
					</Typography>

					<Box
						sx={{
							flexGrow: 1,
							display: { xs: "none", md: "flex" },
						}}
					>
						{pages.map((page) => (
							<Button
								key={page.name}
								onClick={() => navigate(page.path)}
								sx={{ my: 2, color: "white", display: "block" }}
							>
								{page.name}
							</Button>
						))}
					</Box>

					{/* ✅ If logged in, show avatar + menu */}
					{user ? (
						<Box sx={{ flexGrow: 0 }}>
							<IconButton
								onClick={handleOpenUserMenu}
								sx={{ p: 0 }}
							>
								<Avatar alt={user.username} src="/avatar.png" />
							</IconButton>
							<Menu
								sx={{ mt: "45px" }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem disabled>
									<Typography textAlign="center">
										{user?.username || "User"}
									</Typography>
								</MenuItem>
								<MenuItem onClick={handleLogout}>
									<Typography textAlign="center">
										Logout
									</Typography>
								</MenuItem>
							</Menu>
						</Box>
					) : (
						/* If user is not logged in, show Log in button */
						<Button onClick={handleLogin} sx={{ color: "white" }}>
							Log in
						</Button>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default ResponsiveAppBar;
