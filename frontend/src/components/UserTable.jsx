import React, { useEffect, useState } from "react";
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Checkbox,
	Box,
	Button,
	CircularProgress,
	Stack,
	Typography,
} from "@mui/material";
import User from "./User.jsx";
import api from "../services/api.js";

const UserTable = () => {
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await api.get("/users/");
			setUsers(response.data);
			setError(null);
		} catch (error) {
			console.error("Error fetching users: ", error);
			setError("Failed to load users");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [selectedUserId, isCreating]);

	const columns = [
		{ id: "first_name", label: "First Name", minWidth: 170 },
		{ id: "last_name", label: "Last Name", minWidth: 170 },
		{ id: "username", label: "Username", minWidth: 170 },
		{ id: "email", label: "Email", minWidth: 100 },
		{ id: "role", label: "Role", minWidth: 100 },
		{ id: "status", label: "Status", minWidth: 100 },
	];

	// Select/Deselect individual user
	const handleSelectUser = (userId) => {
		setSelectedUsers((prevSelected) =>
			prevSelected.includes(userId)
				? prevSelected.filter((id) => id !== userId)
				: [...prevSelected, userId]
		);
	};

	// Select/Deselect all users
	const handleSelectAll = () => {
		setSelectedUsers(
			selectedUsers.length === users.length
				? []
				: users.map((user) => user.id)
		);
	};

	// Check if a user is selected
	const isUserSelected = (userId) => selectedUsers.includes(userId);

	const handleCreateUser = () => {
		setSelectedUserId(null);
		setSelectedUser(null);
		setIsCreating(true);
	};

	const handleUserUpdate = () => {
		if (selectedUsers.length === 1) {
			const userId = selectedUsers[0];
			// Fetch the user details by userID
			const userToUpdate = users.find((user) => user.id === userId);

			if (userToUpdate) {
				setSelectedUserId(userId);
				setSelectedUser(userToUpdate);
				setIsCreating(false);
			} else {
				console.error("User not found to update.");
			}
		}
	};

	const handleUserDelete = async () => {
		try {
			for (let userId of selectedUsers) {
				try {
					const response = await api.delete(`/users/${userId}/`);
					console.log(response);
				} catch (error) {
					console.error(`Error fetching user ${userId}:`, error);
				}
			}
			setSelectedUsers([]); // Clear the selected users after processing
			fetchUsers();
		} catch (error) {
			console.error("Error deactivating users:", error);
		}
	};

	const clearSelection = () => {
		setSelectedUserId(null);
		setSelectedUser(null);
		setIsCreating(false);
		setSelectedUsers([]);
	};

	return (
		<Paper
			sx={{
				width: "100%",
				overflow: "hidden",
				backgroundColor: "transparent",
				boxShadow: "none",
			}}
		>
			<Box mt={1} mb={1} display="flex" gap={1} justifyContent="flex-end">
				{!isCreating && !selectedUserId && (
					<Button
						variant="contained"
						color="primary"
						size="medium"
						onClick={handleCreateUser}
					>
						Create New User
					</Button>
				)}

				{/* Conditionally render Edit/Delete button on select */}
				{!selectedUserId && !isCreating && selectedUsers.length > 0 && (
					<Stack direction="row" spacing={2} ml={1}>
						{selectedUsers.length === 1 && (
							<Button
								variant="contained"
								size="medium"
								color="primary"
								onClick={handleUserUpdate}
							>
								Edit
							</Button>
						)}
						<Button
							variant="contained"
							size="medium"
							color="secondary"
							onClick={handleUserDelete}
							disabled={selectedUsers.length === 0}
						>
							Delete
						</Button>
					</Stack>
				)}
			</Box>

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress />
				</Box>
			) : error ? (
				<Typography color="error" sx={{ p: 3 }}>
					{error}
				</Typography>
			) : !selectedUserId && !isCreating ? (
				<TableContainer>
					<Table stickyHeader aria-label="user table">
						<TableHead>
							<TableRow>
								<TableCell padding="checkbox">
									<Checkbox
										indeterminate={
											selectedUsers.length > 0 &&
											selectedUsers.length < users.length
										}
										checked={
											selectedUsers.length ===
											users.length
										}
										onChange={handleSelectAll}
									/>
								</TableCell>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{users
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((user) => (
									<TableRow
										hover
										role="checkbox"
										tabIndex={-1}
										key={user.id}
										selected={isUserSelected(user.id)}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isUserSelected(
													user.id
												)}
												onChange={() =>
													handleSelectUser(user.id)
												}
											/>
										</TableCell>
										{columns.map((column) => (
											<TableCell key={column.id}>
												{user[column.id]}
											</TableCell>
										))}
									</TableRow>
								))}
						</TableBody>
					</Table>
					<TablePagination
						rowsPerPageOptions={[10, 25, 100]}
						component="div"
						count={users.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={(event, newPage) => setPage(newPage)}
						onRowsPerPageChange={(event) =>
							setRowsPerPage(parseInt(event.target.value, 10))
						}
					/>
				</TableContainer>
			) : (
				<>
					<Button
						variant="contained"
						color="secondary"
						onClick={clearSelection}
						style={{ marginBottom: "10px" }}
						marginTop={0}
					>
						Back to List
					</Button>
					<User
						userId={selectedUserId}
						selectedUser={selectedUser}
						setSelectedUserId={setSelectedUserId}
						clearSelection={clearSelection}
						isCreating={isCreating}
					/>
				</>
			)}
		</Paper>
	);
};

export default UserTable;
