import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, {useState} from "react";
import {Box, Button, IconButton, Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import User from "./User.jsx";


const UserTable = () => {

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const columns = [
        {
            id: 'firstName', label: 'First Name', minWidth: 170
        },
        {
            id: 'lastName', label: 'Last Name', minWidth: 170
        },
        {
            id: 'username', label: 'Username', minWidth: 170
        },
        {
            id: 'email', label: 'Email', minWidth: 100
        },
        {
            id: 'role', label: 'Role', minWidth: 100
        },
        {
            id: 'status', label: 'Status', minWidth: 100
        },
    ];

    function createData(id, firstName, lastName, username, email, role, status) {
        return {id, firstName, lastName, username, email, role, status};
    }

    const users = [
        createData(1, 'John', 'Doe', 'johndoe123', 'johndoe@example.com', 'Admin', 'Active'),
        createData(2, 'Jane', 'Smith', 'janesmith456', 'janesmith@example.com', 'User', 'Inactive'),
        createData(3, 'Emily', 'Johnson', 'emilyjohnson789', 'emilyj@example.com', 'User', 'Active'),
        createData(4, 'Michael', 'Williams', 'michaelwilliams101', 'michaelw@example.com', 'Moderator', 'Active'),
        createData(5, 'Sarah', 'Brown', 'sarahbrown202', 'sarahb@example.com', 'Admin', 'Inactive'),
        createData(6, 'David', 'Jones', 'davidjones303', 'davidj@example.com', 'User', 'Active'),
        createData(7, 'Jessica', 'Miller', 'jessicamiller404', 'jessicam@example.com', 'Moderator', 'Inactive'),
        createData(8, 'James', 'Davis', 'jamesdavis505', 'jamesd@example.com', 'User', 'Active'),
        createData(9, 'Daniel', 'Martinez', 'danielmartinez606', 'danielm@example.com', 'Admin', 'Active'),
        createData(10, 'Olivia', 'Hernandez', 'oliviah123', 'oliviah@example.com', 'User', 'Inactive'),
        createData(11, 'Ethan', 'Lopez', 'ethanlopez789', 'ethanl@example.com', 'Moderator', 'Active'),
        createData(12, 'Sophia', 'García', 'sophiagarcía101', 'sophiag@example.com', 'User', 'Inactive'),
        createData(13, 'Mason', 'Rodriguez', 'masonrodriguez202', 'masonr@example.com', 'Admin', 'Active'),
        createData(14, 'Isabella', 'Wilson', 'isabellawilson303', 'isabellaw@example.com', 'User', 'Inactive'),
        createData(15, 'Lucas', 'Martínez', 'lucasmartinez404', 'lucasm@example.com', 'Moderator', 'Active'),
        createData(16, 'Charlotte', 'Anderson', 'charlotteanderson505', 'charlottea@example.com', 'Admin', 'Active'),
        createData(17, 'Benjamin', 'Thomas', 'benjaminthomas606', 'benjamint@example.com', 'User', 'Inactive'),
        createData(18, 'Amelia', 'Jackson', 'ameliajackson707', 'ameliaj@example.com', 'Moderator', 'Active'),
        createData(19, 'Henry', 'White', 'henrywhite808', 'henryw@example.com', 'Admin', 'Inactive'),
        createData(20, 'Avery', 'Lee', 'averylee909', 'averyl@example.com', 'User', 'Active'),

    ];

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);


    const handleCreateUser = () => {
        setSelectedUserId(null);
        setIsCreating(true); // Enable create mode
    };


    const handleUserUpdate = (userId) => {
        setSelectedUserId(userId);
        setIsCreating(false);
    }
    const handleUserDelete = (userId) => {
        setSelectedUserId(userId);
        setIsCreating(false);
    }

    const clearSelection = () => {
        setSelectedUserId(null);
        setIsCreating(false); // Exit create mode when form is closed
    };

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
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
            {!selectedUserId && !isCreating ? (
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{minWidth: column.minWidth}}
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
                                .map((user) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={user.code}>
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
                                                {/*<Button*/}
                                                {/*    variant="contained"*/}
                                                {/*    onClick={() => handleUserUpdate(user.id)}*/}
                                                {/*>*/}
                                                {/*    Update*/}
                                                {/*</Button>*/}
                                                <IconButton color="primary" onClick={() => handleUserUpdate(user.id)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleUserDelete(user.id)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                    />
                </TableContainer>
            ) : (
                <>
                    <Button variant="contained" color="secondary" onClick={clearSelection}
                            style={{marginBottom: '10px'}}>
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
}


export default UserTable;
