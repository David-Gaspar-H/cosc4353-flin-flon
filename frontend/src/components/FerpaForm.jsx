import React, { useState } from "react";
import {
	Grid2,
	Paper,
	Typography,
	TextField,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	Box,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
} from "@mui/material";
import Signature from "./Signature.jsx";
import { useUser } from "./context/UserContext";

const FerpaForm = () => {
	// Get system date to prefill form field
	const currentDate = new Date();
	const dateFriendlyFormat = currentDate.toLocaleDateString();
	const { user } = useUser();

	// Function to open the dialog
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};

	// Function to close the dialog
	const handleClose = () => {
		setOpen(false);
	};
	// Form data state
	const [formData, setFormData] = useState({
		name: user ? `${user.first_name} ${user.last_name}` : "", // capture from user session
		releaseTo: "",
		password: "",
		peopleSoftId: "",
		date: [dateFriendlyFormat],
	});

	// Dynamically update input
	const handleChange = (e) => {
		setFormData({ ...setFormData, [e.target.name]: e.target.value });
	};

	// Handle form submit
	const handleSubmit = async () => {};

	return (
		<Grid2
			container
			justifyContent={"center"}
			alignItems={"center"}
			p={4}
			sx={{ height: "100vh" }}
		>
			<Paper sx={{ width: "100%", padding: 10, position: "relative" }}>
				<Typography
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						fontWeight: "bold",
						p: 3,
						fontSize: 14,
					}}
				>
					Form No. OGC-SF-2006-02
				</Typography>

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Typography variant="h4" align="center">
						AUTHORIZATION TO RELEASE EDUCATIONAL RECORDS
					</Typography>
					<Typography variant="h6" align="center" gutterBottom>
						Family Educational Rights and Privacy Act of 1974 as
						Amended (FERPA)
					</Typography>
				</Box>
				<form onSubmit={handleSubmit}>
					<FormControl fullWidth margin={"normal"}>
						<Box paddingTop={3}>
							<Typography>
								I,
								<TextField
									value={formData.name}
									name="name"
									onChange={handleChange}
									size="small"
									sx={{
										width: "150px",
										marginLeft: 1,
										marginRight: 1,
									}}
								/>
								hereby voluntarily authorize officials in the
								University of Houston - Main identified below to
								disclose personally identifiable information
								from my educational records. (Please check the
								box or boxes that apply):
							</Typography>
						</Box>
						<Box
							paddingTop={1}
							sx={{ display: "flex", flexDirection: "column" }}
						>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Office of the University Registrar"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Scholarships and Financial Aid"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Student Financial Services"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Undergraduate Scholars @ UH (formally USD)"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="University Advancement"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Dean of Students Office"
							/>
							<FormControlLabel
								sx={{
									pl: 10,
									pt: 1,
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
								control={<Checkbox />}
								label={
									<>
										Other (Please Specify)
										<TextField
											size="small"
											sx={{
												width: "150px",
												pl: 1,
												alignSelf: "center",
											}}
										/>
									</>
								}
							/>
						</Box>
						<Box paddingTop={3}>
							<Typography>
								Specifically, I authorize the disclosure of the
								following information or category of
								information. (Please check the box or boxes that
								apply):
							</Typography>
						</Box>
						<Box
							paddingTop={2}
							sx={{ display: "flex", flexDirection: "column" }}
						>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Academic Advising Profile/Information"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Academic Records"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="All University Records"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Billing/Financial Aid"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Disciplinary"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Grades/Transcripts"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Housing"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Photos"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Scholarships and/or Honors"
							/>
							<FormControlLabel
								sx={{
									pl: 10,
									pt: 1,
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
								control={<Checkbox />}
								label={
									<>
										Other (Please Specify)
										<TextField
											size="small"
											sx={{
												width: "150px",
												pl: 1,
												alignSelf: "center",
											}}
										/>
									</>
								}
							/>
						</Box>
						<Box paddingTop={3}>
							<Typography>
								The information may be released to:
								<Tooltip title="Print name(s) of Individual(s) to whom the University may disclose information, comma separated">
									<TextField
										value={formData.releaseTo}
										name="releaseTo"
										onChange={handleChange}
										size="small"
										sx={{
											width: "700px",
											marginLeft: 1,
											marginRight: 1,
										}}
									/>
								</Tooltip>
								for the purpose of informing:
							</Typography>
						</Box>
						<Box
							paddingTop={1}
							sx={{ display: "flex", flexDirection: "column" }}
						>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Family"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Educational Institution"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Honor or Award"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Employer/Prospective Employer"
							/>
							<FormControlLabel
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Public or Media of Scholarship"
							/>
							<FormControlLabel
								sx={{
									pl: 10,
									pt: 1,
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
								control={<Checkbox />}
								label={
									<>
										Other (Please Specify)
										<TextField
											size="small"
											sx={{
												width: "150px",
												pl: 1,
												alignSelf: "center",
											}}
										/>
									</>
								}
							/>
						</Box>
						<Box
							pt={5}
							sx={{ display: "flex", flexDirection: "column" }}
						>
							<Typography>
								Please provide a password to obtain information
								via the phone:
								<TextField
									name="password"
									value={formData.password}
									sx={{
										width: "150px",
										pl: 1,
									}}
									size="small"
								/>
								. The password should not contain more than ten
								(10) letters. You must provide the password to
								the individuals or agencies listed above. The
								University will not release information to the
								caller if the caller does not have the password.
								A new form must be completed to change your
								password.
							</Typography>
							<Typography fontWeight={"bold"} pt={3}>
								This is to attest that I am a student signing
								this form. I understand the information may be
								released orally or in the form of copies of
								written records, as preferred by the requester.
								This authorization will remain in effect from
								the date it is executed until revoked by me, in
								writing, and delivered to the Department(s)
								identified above.
							</Typography>
						</Box>

						<Box
							component="form"
							sx={{
								display: "flex",
								flexDirection: "row",
								"& .MuiTextField-root": {
									m: 1,
									flexGrow: 1,
								},
								alignItems: "center",
								pt: 5,
							}}
							noValidate
							autoComplete="off"
						>
							<TextField
								variant="outlined"
								margin="normal"
								value={formData.name}
								onChange={handleChange}
								sx={{
									marginRight: 2,
								}}
							/>
							<Button
								variant="outlined"
								onClick={handleOpen}
								sx={{
									fontSize: "13px",
									width: "10%",
									paddingRight: "20px",
									marginLeft: 1,
									marginRight: 5,
									height: "50px",
								}}
							>
								Upload Signature
							</Button>
							<Dialog open={open} onClose={handleClose}>
								<DialogTitle>Signature</DialogTitle>
								<DialogContent>
									<Signature id="isso"></Signature>
								</DialogContent>
								<DialogActions>
									<Button
										onClick={handleClose}
										color="primary"
									>
										Close
									</Button>
								</DialogActions>
							</Dialog>
							<TextField
								label="PSID"
								margin="normal"
								name="peopleSoftId"
								onChange={handleChange}
								marginRight={5}
							/>
							<Typography
								variant="h6"
								marginLeft={3}
								name="date"
								type="date"
								sx={{
									flexGrow: 1,
								}}
							>
								Date: {formData.date}
							</Typography>
						</Box>
					</FormControl>
				</form>
			</Paper>
		</Grid2>
	);
};

export default FerpaForm;
