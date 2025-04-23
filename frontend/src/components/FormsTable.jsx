import React, { useState, useEffect } from "react";
import {
	TableRow,
	TableCell,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	CircularProgress,
	Alert,
	Box,
	Typography,
	TablePagination,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	TextField,
} from "@mui/material";
import ReduceCourseLoadForm from "./ReduceCourseLoadForm.jsx";
import FerpaForm from "./FerpaForm.jsx";
import api from "../services/api.js";
import { useUser } from "./context/UserContext.jsx";

const columns = [
	{ id: "applicant_name", label: "Applicant Name", minWidth: 170 },
	{ id: "Form", label: "Form Type", minWidth: 170 },
	{ id: "status", label: "Status", minWidth: 170 },
	{ id: "signed_on", label: "Date Submitted", minWidth: 170 },
	{ id: "action", label: "Action", minWidth: 150 },
];

const FormsTable = () => {
	const [open, setOpen] = useState(false);
	const [selectedFormId, setSelectedFormId] = useState(null);
	const [formData, setFormData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [actionLoading, setActionLoading] = useState(false);
	// pagination state
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const { user } = useUser();

	const [openDelegate, setOpenDelegate] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	// Add these state variables at the top of your component (with the other useState declarations)
	const [delegateForm, setDelegateForm] = useState(null);
	const [users, setUsers] = useState([]);
	const [usersLoading, setUsersLoading] = useState(false);

	//date states
	const [dateError, setDateError] = useState("");
	const [startDate, setStartDate] = useState(() => {
		//today's date
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	});
	const [endDate, setEndDate] = useState(() => {
		//standard 7 days from today
		const today = new Date();
		const nextWeek = new Date(today);
		nextWeek.setDate(today.getDate() + 7); // Add 7 days

		const year = nextWeek.getFullYear();
		const month = String(nextWeek.getMonth() + 1).padStart(2, "0");
		const day = String(nextWeek.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	});

	const fetchFormData = async () => {
		setLoading(true);
		try {
			// Use the existing pending approvals endpoint
			const response = await api.get(
				`/pending-approvals/?user=${user.id}`
			);
			console.log("Loaded form data: ", response.data);
			const forms = response.data;
			setFormData(forms);
			setError(null);
		} catch (error) {
			console.error("Error fetching forms: ", error);
			setError("Failed to load forms. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	// Retrieves the eligible delegates for the specified form and logged in user
	const fetchUsers = async (form) => {
		if (!form || !form.id) return;

		setUsersLoading(true);
		try {
			const response = await api.get(
				`/forms/${form.id}/eligible-delegates/?user=${user.id}`
			);
			setUsers(response.data);
			setError(null);
		} catch (error) {
			console.error("Error fetching eligible delegates: ", error);
			setError("Failed to load users for delegation.");
		} finally {
			setUsersLoading(false);
		}
	};

	useEffect(() => {
		fetchFormData();
	}, []);

	const handleClose = () => {
		setOpen(false);
		setSelectedFormId(null);
	};

	console.log(user);

	const handleApprove = async (form) => {
		setActionLoading(true);
		form.user = user.id;
		try {
			const response = await api.post(`/forms/${form.id}/approve/`, form);

			if (response.status === 200) {
				// Refresh the table data
				await fetchFormData();
			}
		} catch (error) {
			console.error("Error approving form: ", error);
			setError("Failed to approve form. Please try again.");
		} finally {
			setActionLoading(false);
		}
	};

	const handleReject = async (form) => {
		form.user = user.id;
		setActionLoading(true);
		try {
			const response = await api.post(`/forms/${form.id}/reject/`, form);

			if (response.status === 200) {
				// Refresh the table data
				await fetchFormData();
			}
		} catch (error) {
			console.error("Error rejecting form: ", error);
			setError("Failed to reject form. Please try again.");
		} finally {
			setActionLoading(false);
		}
	};

	// Modify your handleDelegate function to use the selected user
	const handleDelegate = async (form) => {
		if (!delegateForm || !selectedUser) return;
		const newstartDate = new Date(startDate);
		const newendDate = new Date(endDate);

		if (newstartDate > newendDate) {
			setDateError("Date range is invalid");
			return;
		}

		setActionLoading(true);
		try {
			const response = await api.post(
				`/forms/${delegateForm.id}/delegate/`,
				{
					user: user.id,
					delegate_to: selectedUser.id,
					start_date: startDate, // Consider adding date pickers
					end_date: endDate,
					form_id: form.id,
				}
			);

			if (response.status === 200) {
				await fetchFormData();
				setOpenDelegate(false);
				setDelegateForm(null);
				setSelectedUser(null);
			}
		} catch (error) {
			console.error("Error delegating form: ", error);
			setError("Failed to delegate form. Please try again.");
		} finally {
			setActionLoading(false);
		}
	};

	// Handle page change
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	// Handle rows per page change
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleStartDateChange = (e) => {
		setStartDate(e);
		setDateError("");
		return true;
	};
	const handleEndDateChange = (e) => {
		setEndDate(e);
		setDateError("");
		return true;
	};

	// Calculate paginated data
	const getPaginatedData = () => {
		return formData.slice(
			page * rowsPerPage,
			page * rowsPerPage + rowsPerPage
		);
	};

	return (
		<>
			<Typography variant="h4" sx={{ mb: 3 }} align="center">
				{user.first_name}'s Forms
			</Typography>
			<Typography variant="h6" sx={{ pl: 5 }}>
				Department: {user.unit ? user.unit.name : 'No Department Assigned'}
			</Typography>
			<Box
				sx={{
					p: 3,
					backgroundColor: "#f5f5f5",
					borderRadius: 2,
					minHeight: "100vh",
				}}
			>
				{/* Display error message if there is an error */}
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

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
							{loading ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										align="center"
										sx={{ py: 4 }}
									>
										<CircularProgress />
										<Box sx={{ mt: 1 }}>
											Loading forms...
										</Box>
									</TableCell>
								</TableRow>
							) : formData.length > 0 ? (
								getPaginatedData().map((form, index) => (
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
										<TableCell>{form.data?.name}</TableCell>
										<TableCell>{form.type}</TableCell>
										<TableCell>{form.status}</TableCell>
										<TableCell>{form.signed_on}</TableCell>
										<TableCell>
											{/*<Button*/}
											{/*    variant="contained"*/}
											{/*    color="primary"*/}
											{/*    onClick={() => handleSubmit(form)}*/}
											{/*    size="small"*/}
											{/*    sx={{mr: 1}}*/}
											{/*    disabled={actionLoading}*/}
											{/*>*/}
											{/*    {actionLoading ? "Processing..." : "Submit"}*/}
											{/*</Button>*/}
											<Button
												variant="contained"
												color="success"
												onClick={() =>
													handleApprove(form)
												}
												size="small"
												sx={{ mr: 1 }}
												disabled={
													actionLoading ||
													form.status !== "submitted"
												}
											>
												{actionLoading
													? "Processing..."
													: "Approve"}
											</Button>
											<Button
												variant="contained"
												color="error"
												onClick={() =>
													handleReject(form)
												}
												size="small"
												sx={{ mr: 1 }}
												disabled={
													actionLoading ||
													form.status !== "submitted"
												}
											>
												{actionLoading
													? "Processing..."
													: "Reject"}
											</Button>
											<Button
												variant="contained"
												onClick={() => {
													setDelegateForm(form);
													setOpenDelegate(true);
													setSelectedUser(null);
													fetchUsers(form); // Load users when opening the dialog
												}}
												size="small"
												sx={{ mr: 1 }}
												disabled={
													actionLoading ||
													form.status !==
														"submitted" ||
													form.is_delegated
												}
											>
												{actionLoading
													? "Processing..."
													: form.is_delegated
														? "Delegated"
														: "Delegate"}
											</Button>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										align="center"
									>
										No records found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					{/* Add TablePagination component */}
					{!loading && formData.length > 0 && (
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={formData.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					)}
				</TableContainer>

				{/* Dialog */}
				<Dialog
					open={open}
					onClose={handleClose}
					sx={{
						"& .MuiDialog-paper": {
							width: "80%",
							maxWidth: "90%",
						},
					}}
				>
					<DialogTitle>
						Edit {selectedFormId?.firstName}{" "}
						{selectedFormId?.lastName}
					</DialogTitle>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Close
						</Button>
					</DialogActions>
					<DialogContent>
						{selectedFormId?.from === "Reduce Course Load" && (
							<ReduceCourseLoadForm handleClose={handleClose} />
						)}
						{selectedFormId?.from === "FERPA" && (
							<FerpaForm handleClose={handleClose} />
						)}
					</DialogContent>
				</Dialog>
			</Box>

			<Dialog
				open={openDelegate}
				onClose={() => {
					setOpenDelegate(false);
					// Don't reset searchTerm here if you want it to persist
				}}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Delegate Form to User</DialogTitle>
				<DialogContent>
					<Box sx={{ mb: 2 }}>
						<TextField
							label="Search users"
							variant="outlined"
							fullWidth
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							sx={{ mb: 2 }}
						/>
					</Box>

					{usersLoading ? (
						<Box display="flex" justifyContent="center" p={2}>
							<CircularProgress />
						</Box>
					) : (
						<List
							sx={{
								height: 200,
							}}
						>
							{users
								.filter((user) =>
									user.username
										.toLowerCase()
										.includes(searchTerm.toLowerCase())
								)
								.map((user) => (
									<ListItemButton
										key={user.id}
										onClick={() => setSelectedUser(user)}
										selected={selectedUser?.id === user.id}
									>
										<ListItemText
											primary={`Name: ${user.first_name + " " + user.last_name}`}
											secondary={`${user.unit?.name || "No Unit"} — ${user.email} `}
										/>
									</ListItemButton>
								))}
						</List>
					)}
				</DialogContent>
				<DialogContent>
					<Box>
						<Typography>
							From:
							<TextField
								size="small"
								sx={{
									width: "150px",
									marginLeft: 1,
									marginRight: 1,
								}}
								name="FromDate"
								onChange={(e) =>
									handleStartDateChange(e.target.value)
								}
								type="date"
							></TextField>
							To:
							<TextField
								size="small"
								sx={{
									width: "150px",
									marginLeft: 1,
									marginRight: 1,
								}}
								name="ToDate"
								onChange={(e) =>
									handleEndDateChange(e.target.value)
								}
								type="date"
							></TextField>
							<Typography sx={{ color: "red" }}>
								{dateError}
							</Typography>
						</Typography>
					</Box>
				</DialogContent>

				<DialogActions>
					<Button onClick={() => setOpenDelegate(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => handleDelegate(delegateForm)}
						disabled={!selectedUser || actionLoading}
						variant="contained"
					>
						{actionLoading ? "Delegating..." : "Confirm Delegation"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default FormsTable;
