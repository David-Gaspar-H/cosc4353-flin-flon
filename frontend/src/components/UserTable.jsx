import React, { useState } from "react";
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
	IconButton,
	Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import User from "./User.jsx";
import users from "./users.js";

const UserTable = () => {
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const columns = [
		{ id: "firstName", label: "First Name", minWidth: 170 },
		{ id: "lastName", label: "Last Name", minWidth: 170 },
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
		setIsCreating(true);
	};

	const handleUserUpdate = () => {
		if (selectedUsers.length === 1) {
			setSelectedUserId(selectedUsers[0]);
			setIsCreating(false);
		}
	};

	const handleUserDelete = () => {
		console.log("Deleting users:", selectedUsers);
		setSelectedUsers([]);
	};

	const clearSelection = () => {
		setSelectedUserId(null);
		setIsCreating(false);
		setSelectedUsers([]);
	};

	return (
		<Paper sx={{ width: "100%", overflow: "hidden" }}>
			<Box mt={4} mb={4} display="flex" gap={2} alignItems="center">
				<Button
					variant="contained"
					color="primary"
					onClick={handleCreateUser}
				>
					Create New User
				</Button>

				{/* Conditionally render Edit/Delete button on select */}
				{selectedUsers.length > 0 && (
					<Stack direction="row" spacing={2}>
						{selectedUsers.length === 1 && (
							<Button
								variant="contained"
								color="primary"
								onClick={handleCreateUser}
							>
								Edit
							</Button>
						)}
						<Button
							variant="contained"
							color="secondary"
							onClick={handleUserDelete}
						>
							Delete
						</Button>
					</Stack>
				)}
			</Box>

			{!selectedUserId && !isCreating ? (
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
					>
						Back to List
					</Button>
					<User
						userId={selectedUserId}
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
