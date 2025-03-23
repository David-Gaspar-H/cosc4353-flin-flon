import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
	Stack,
} from "@mui/material";
import Signature from "./Signature.jsx";
import { useUser } from "./context/UserContext";
import api from "../services/api";

const FerpaForm = () => {
	// Get system date to prefill form field
	const currentDate = new Date();
	const dateFriendlyFormat = currentDate.toLocaleDateString();
	const { user } = useUser();
	const navigate = useNavigate();

	// To save the signature
	const [signature, setSignature] = useState(null);

	// Function to open the dialog
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};

	// Function to close the dialog
	const handleClose = () => {
		setOpen(false);
	};

	// Generate random form id
	const generateRandomId = () => {
		return Math.floor(Math.random() * 1000000);
	};

	// Form data state
	const [formData, setFormData] = useState({
		id: generateRandomId(),
		user: user?.id || "",
		signed_on: dateFriendlyFormat,
		status: "draft",
		data: {
			name: user ? `${user.first_name} ${user.last_name}` : "", // capture from user session
			registrar: false,
			scholarships: false,
			financialAid: false,
			undergradScholars: false,
			universityAdvancement: false,
			deanOfStudentOffice: false,
			otherOfficials: false,
			otherOfficialsText: "",
			advising: false,
			academicRecords: false,
			universityRecords: false,
			billingFinancialAid: false,
			disciplinary: false,
			gradesTranscripts: false,
			housing: false,
			photos: false,
			scholarshipsHonors: false,
			otherCategories: false,
			otherCategoriesText: "",
			releaseTo: "",
			family: false,
			educationalInstitutions: false,
			honorAward: false,
			employer: false,
			publicOrMedia: false,
			otherReleaseTo: false,
			otherReleaseToText: "",
			password: "",
			peopleSoftId: "",
			signature: "",
		},
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		setFormData((prevState) => {
			// Determine new value to be updated
			const newValue = type === "checkbox" ? checked : value;

			// Update field if it exists in data
			if (name in prevState.data) {
				return {
					...prevState,
					data: {
						...prevState.data,
						[name]: newValue,
					},
				};
			}

			// otherwise update root-level field
			return {
				...prevState,
				[name]: newValue,
			};
		});
	};

	// Handle form submit
	const handleSubmit = async (status) => {
		// Update formData
		const updatedFormData = { ...formData, status };

		try {
			const response = await api.post("/forms/", updatedFormData);

			if (!response.ok) {
				throw new Error("Failed to submit form.");
			}

			alert("Form submitted successfully! Pending review.");
			console.log("Form submitted successfully with status: ", status);
			navigate("/my-forms");
		} catch (error) {
			console.error("Error submitting form:", error);
		}

		console.log("Data being sent to the post request: ", updatedFormData);
	};

	const handleSave = (imageData) => {
		setSignature(imageData);
		setFormData((prevState) => ({
			...prevState,
			data: {
				...prevState.data,
				signature: imageData,
			},
		}));
		handleClose();
	};

	return (
		<Grid2
			container
			justifyContent={"center"}
			alignItems={"center"}
			p={4}
			sx={{ minHeight: "fit-content" }}
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
				<form onSubmit={(e) => e.preventDefault()}>
					<FormControl fullWidth margin={"normal"}>
						<Box paddingTop={3}>
							<Typography>
								I,
								<TextField
									value={formData.data.name}
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
								checked={formData.data.registrar}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								name="registrar"
								label="Office of the University Registrar"
								onChange={handleChange}
							/>
							<FormControlLabel
								checked={formData.data.scholarships}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Scholarships and Financial Aid"
								onChange={handleChange}
								name="scholarships"
							/>
							<FormControlLabel
								checked={formData.data.financialAid}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Student Financial Services"
								onChange={handleChange}
								name="financialAid"
							/>
							<FormControlLabel
								checked={formData.data.undergradScholars}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Undergraduate Scholars @ UH (formally USD)"
								onChange={handleChange}
								name="undergradScholars"
							/>
							<FormControlLabel
								checked={formData.data.universityAdvancement}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="University Advancement"
								onChange={handleChange}
								name="universityAdvancement"
							/>
							<FormControlLabel
								checked={formData.data.deanOfStudentOffice}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Dean of Students Office"
								onChange={handleChange}
								name="deanOfStudentOffice"
							/>
							<FormControlLabel
								checked={formData.data.otherOfficials}
								sx={{
									pl: 10,
									pt: 1,
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
								control={<Checkbox />}
								onChange={handleChange}
								name="otherOfficials"
								label={
									<>
										Other (Please Specify)
										<TextField
											name="otherOfficialsText"
											value={
												formData.data.otherOfficialsText
											}
											size="small"
											sx={{
												width: "150px",
												pl: 1,
												alignSelf: "center",
											}}
											onChange={handleChange}
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
								checked={formData.data.advising}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Academic Advising Profile/Information"
								onChange={handleChange}
								name="advising"
							/>
							<FormControlLabel
								checked={formData.data.academicRecords}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Academic Records"
								onChange={handleChange}
								name="academicRecords"
							/>
							<FormControlLabel
								checked={formData.data.universityRecords}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="All University Records"
								onChange={handleChange}
								name="universityRecords"
							/>
							<FormControlLabel
								checked={formData.data.billingFinancialAid}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Billing/Financial Aid"
								onChange={handleChange}
								name="billingFinancialAid"
							/>
							<FormControlLabel
								checked={formData.data.disciplinary}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Disciplinary"
								onChange={handleChange}
								name="disciplinary"
							/>
							<FormControlLabel
								checked={formData.data.gradesTranscripts}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Grades/Transcripts"
								onChange={handleChange}
								name="gradesTranscripts"
							/>
							<FormControlLabel
								checked={formData.data.housing}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Housing"
								onChange={handleChange}
								name="housing"
							/>
							<FormControlLabel
								checked={formData.data.photos}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Photos"
								onChange={handleChange}
								name="photos"
							/>
							<FormControlLabel
								checked={formData.data.scholarshipsHonors}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Scholarships and/or Honors"
								onChange={handleChange}
								name="scholarshipsHonors"
							/>
							<FormControlLabel
								checked={formData.data.otherCategories}
								onChange={handleChange}
								name="otherCategories"
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
											name="otherCategoriesText"
											value={
												formData.data
													.otherCategoriesText
											}
											size="small"
											sx={{
												width: "150px",
												pl: 1,
												alignSelf: "center",
											}}
											onChange={handleChange}
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
										value={formData.data.releaseTo}
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
								checked={formData.data.family}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Family"
								onChange={handleChange}
								name="family"
							/>
							<FormControlLabel
								checked={formData.data.educationalInstitutions}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Educational Institution"
								onChange={handleChange}
								name="educationalInstitutions"
							/>
							<FormControlLabel
								checked={formData.data.honorAward}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Honor or Award"
								onChange={handleChange}
								name="honorAward"
							/>
							<FormControlLabel
								checked={formData.data.employer}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Employer/Prospective Employer"
								onChange={handleChange}
								name="employer"
							/>
							<FormControlLabel
								checked={formData.data.publicOrMedia}
								sx={{ pl: 10, pt: 0.5 }}
								control={<Checkbox />}
								label="Public or Media of Scholarship"
								onChange={handleChange}
								name="publicOrMedia"
							/>
							<FormControlLabel
								checked={formData.data.otherReleaseTo}
								onChange={handleChange}
								name="otherReleaseTo"
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
											name="otherReleaseToText"
											value={
												formData.data.otherReleaseToText
											}
											onChange={handleChange}
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
									value={formData.data.password}
									onChange={handleChange}
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
								value={formData.data.name}
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
									<Signature
										id="ferpa"
										onSave={handleSave}
									></Signature>
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
								value={formData.data.peopleSoftId}
								onChange={handleChange}
								marginRight={5}
							/>
							<Typography
								variant="h6"
								marginLeft={3}
								name="signed_on"
								type="date"
								sx={{
									flexGrow: 1,
								}}
							>
								Date: {formData.signed_on}
							</Typography>
						</Box>
						<Stack
							spacing={2}
							mt={2}
							direction={"row"}
							sx={{
								justifyContent: "flex-end",
								alignItems: "center",
							}}
						>
							<Button
								variant="contained"
								type="button"
								color="success"
								onClick={() => handleSubmit("draft")}
								sx={{
									marginTop: 2,
									display: "inline-block !important",
								}}
							>
								Save
							</Button>
							<Button
								variant="contained"
								type="submit"
								onClick={() => handleSubmit("submitted")}
								sx={{
									marginTop: 2,
									display: "inline-block !important",
								}}
							>
								Submit
							</Button>
						</Stack>
					</FormControl>
				</form>
			</Paper>
		</Grid2>
	);
};

export default FerpaForm;
