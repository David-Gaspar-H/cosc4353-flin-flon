import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
	Box,
	Typography,
	Link,
	IconButton,
	Stack,
	Divider,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";

const Footer = () => {
	return (
		<Box
			component="footer"
			sx={{
				mt: "auto",
				px: { xs: 3, md: 6 },
				py: 4,
				backgroundColor: "#f8f9fa",
				borderTop: "1px solid #e0e0e0",
			}}
		>
			<Stack
				direction={{ xs: "column", md: "row" }}
				spacing={4}
				justifyContent="space-between"
				alignItems={{ xs: "flex-start", md: "center" }}
			>
				{/* Left: Logo & Info */}
				<Stack direction="row" spacing={2} alignItems="center">
					<img
						src="/cube.png"
						alt="FlinFlon"
						width={45}
						height={45}
					/>
					<Box>
						<Typography variant="subtitle1" fontWeight={600}>
							FlinFlon University
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Office of the University Registrar
						</Typography>
					</Box>
				</Stack>

				{/* Center: Useful Links */}
				<Stack direction="row" spacing={4}>
					<Box>
						<Typography variant="subtitle2" gutterBottom>
							Resources
						</Typography>
						<Link
							component={RouterLink}
							to="/form-request"
							underline="hover"
							color="text.secondary"
						>
							Submit a Form
						</Link>
						<br />
						<Link
							component={RouterLink}
							to="/my-forms"
							underline="hover"
							color="text.secondary"
						>
							My Forms
						</Link>
					</Box>

					<Box>
						<Typography variant="subtitle2" gutterBottom>
							Contact
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Email:{" "}
							<Link href="mailto:registrar@flinflon.edu">
								registrar@flinflon.edu
							</Link>
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Phone: (713) 743-5065
						</Typography>
					</Box>
				</Stack>

				{/* Right: Social Icons */}
				<Stack direction="row" spacing={1}>
					<IconButton href="#" aria-label="Twitter" color="primary">
						<TwitterIcon />
					</IconButton>
					<IconButton href="#" aria-label="GitHub" color="primary">
						<GitHubIcon />
					</IconButton>
					<IconButton href="#" aria-label="Website" color="primary">
						<LanguageIcon />
					</IconButton>
				</Stack>
			</Stack>

			<Divider sx={{ my: 3 }} />

			<Typography variant="body2" align="center" color="text.secondary">
				&copy; {new Date().getFullYear()} FlinFlon University. All
				rights reserved.
			</Typography>
		</Box>
	);
};

export default Footer;
