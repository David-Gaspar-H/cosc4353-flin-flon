import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography, CircularProgress } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import User from "./User.jsx";
import api from '../services/api';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/');
            setUsers(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { id: 'first_name', label: 'First Name', minWidth: 170 },
        { id: 'last_name', label: 'Last Name', minWidth: 170 },
        { id: 'username', label: 'Username', minWidth: 170 },
        { id: 'email', label: 'Email', minWidth: 100 },
        { id: 'role', label: 'Role', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 100 },
    ];

    const handleCreateUser = () => {
        setSelectedUserId(null);
        setIsCreating(true);
    };

    const handleUserUpdate = (userId) => {
        setSelectedUserId(userId);
        setIsCreating(false);
    };

    const handleUserDelete = async (userId) => {
        try {
            await api.delete(`/users/${userId}/`);
            fetchUsers(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const clearSelection = () => {
        setSelectedUserId(null);
        setIsCreating(false);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box mt={4} mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" align="center" gutterBottom>
                    User Information
                </Typography>
                {!isCreating && !selectedUserId && (
                    <Button variant="contained" color="primary" onClick={handleCreateUser}>
                        Create New User
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" sx={{ p: 3 }}>
                    {error}
                </Typography>
            ) : !selectedUserId && !isCreating ? (
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                                        {columns.map((column) => {
                                            const value = user[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleUserUpdate(user.id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleUserDelete(user.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
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
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                    />
                </TableContainer>
            ) : (
                <>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={clearSelection}
                        style={{ marginBottom: '10px' }}
                    >
                        Back to List
                    </Button>
                    <User
                        userId={selectedUserId}
                        setSelectedUserId={setSelectedUserId}
                        clearSelection={clearSelection}
                        isCreating={isCreating}
                        onUserModified={fetchUsers}
                    />
                </>
            )}
        </Paper>
    );
};

export default UserTable;