import React, { useState } from "react";
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
} from "@mui/material";
import ReduceCourseLoadForm from "./ReduceCourseLoadForm.jsx";
import FerpaForm from "./FerpaForm.jsx";

const FormTable = ({ isAdmin, formsData }) => {
	const [open, setOpen] = useState(false);
	const [currentRow, setCurrentRow] = useState(null);

	console.log("Received formsData:", formsData);
	console.log("Is Admin:", isAdmin);

	// Dynamic columns based on user role
	const columns = isAdmin
		? [
				{ id: "requestor", label: "Requestor Name" },
				{ id: "submitted", label: "Date Submitted" },
				{ id: "view", label: "View Form" },
				{ id: "extra_requestor", label: "Needs Another Requestor?" },
			]
		: [
				{ id: "form_name", label: "Form Name" },
				{ id: "view", label: "View Form" },
				{ id: "submitted", label: "Date Submitted" },
				{ id: "status", label: "Status" },
			];

	const handleViewForm = (row) => {
		setCurrentRow(row);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setCurrentRow(null);
	};

	return (
		<Box sx={{ p: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
			<Typography
				variant="h5"
				fontWeight="bold"
				sx={{ mb: 2, color: "#333", textAlign: "center" }}
			>
				{isAdmin ? "Pending Approvals" : "Your Form Submissions"}
			</Typography>

			<TableContainer
				component={Paper}
				elevation={3}
				sx={{ borderRadius: 2 }}
			>
				<Table>
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									sx={{
										fontWeight: "bold",
										fontSize: "16px",
										backgroundColor: "#fff",
										color: "#2f4454",
									}}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{formsData.map((row, index) => (
							<TableRow
								key={index}
								sx={{
									"&:nth-of-type(even)": {
										backgroundColor: "#f5f5f5",
									},
									"&:hover": {
										backgroundColor: "#e0e0e0",
										cursor: "pointer",
									},
								}}
							>
								{isAdmin ? (
									<>
										<TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
										<TableCell>
											{row.dateSubmitted}
										</TableCell>
										<TableCell>
											<Button
												variant="contained"
												color="primary"
												sx={{
													textTransform: "none",
													borderRadius: "8px",
													marginRight: "8px",
												}}
												onClick={() =>
													handleViewForm(row)
												}
											>
												View
											</Button>
										</TableCell>
										<TableCell>
											<Typography
												sx={{
													fontWeight: "bold",
													color: row.needsAnotherRequestor
														? "red"
														: "green",
												}}
											>
												{row.needsAnotherRequestor
													? "Yes"
													: "No"}
											</Typography>
										</TableCell>
									</>
								) : (
									<>
										<TableCell>{row.formName}</TableCell>
										<TableCell>
											<Button
												variant="contained"
												color="primary"
												sx={{
													textTransform: "none",
													borderRadius: "8px",
													marginRight: "8px",
												}}
												onClick={() =>
													handleViewForm(row)
												}
											>
												View
											</Button>
										</TableCell>
										<TableCell>
											{row.dateSubmitted}
										</TableCell>
										<TableCell>
											<Typography
												sx={{
													fontWeight: "bold",
													color:
														row.status === "Pending"
															? "orange"
															: "green",
												}}
											>
												{row.status}
											</Typography>
										</TableCell>
									</>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Dialog for viewing forms */}
			<Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
				<DialogTitle>View Form</DialogTitle>
				<DialogContent>
					{currentRow?.formName === "Reduce Course Load" && (
						<ReduceCourseLoadForm />
					)}
					{currentRow?.formName === "FERPA" && <FerpaForm />}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default FormTable;
