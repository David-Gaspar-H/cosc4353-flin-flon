import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React from "react";
import {Button} from "@mui/material";


const UserTable = () => {

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

    function createData(firstName, lastName, username, email, role, status) {
        return {firstName, lastName, username, email, role, status};
    }

    const rows = [
        createData('John', 'Doe', 'johndoe123', 'johndoe@example.com', 'Admin', 'Active'),
        createData('Jane', 'Smith', 'janesmith456', 'janesmith@example.com', 'User', 'Inactive'),
        createData('Emily', 'Johnson', 'emilyjohnson789', 'emilyj@example.com', 'User', 'Active'),
        createData('Michael', 'Williams', 'michaelwilliams101', 'michaelw@example.com', 'Moderator', 'Active'),
        createData('Sarah', 'Brown', 'sarahbrown202', 'sarahb@example.com', 'Admin', 'Inactive'),
        createData('David', 'Jones', 'davidjones303', 'davidj@example.com', 'User', 'Active'),
        createData('Jessica', 'Miller', 'jessicamiller404', 'jessicam@example.com', 'Moderator', 'Inactive'),
        createData('James', 'Davis', 'jamesdavis505', 'jamesd@example.com', 'User', 'Active'),
        createData('Daniel', 'Martinez', 'danielmartinez606', 'danielm@example.com', 'Admin', 'Active'),
        createData('Olivia', 'Hernandez', 'oliviah123', 'oliviah@example.com', 'User', 'Inactive'),
        createData('Ethan', 'Lopez', 'ethanlopez789', 'ethanl@example.com', 'Moderator', 'Active'),
        createData('Sophia', 'García', 'sophiagarcía101', 'sophiag@example.com', 'User', 'Inactive'),
        createData('Mason', 'Rodriguez', 'masonrodriguez202', 'masonr@example.com', 'Admin', 'Active'),
        createData('Isabella', 'Wilson', 'isabellawilson303', 'isabellaw@example.com', 'User', 'Inactive'),
        createData('Lucas', 'Martínez', 'lucasmartinez404', 'lucasm@example.com', 'Moderator', 'Active'),
        createData('Charlotte', 'Anderson', 'charlotteanderson505', 'charlottea@example.com', 'Admin', 'Active'),
        createData('Benjamin', 'Thomas', 'benjaminthomas606', 'benjamint@example.com', 'User', 'Inactive'),
        createData('Amelia', 'Jackson', 'ameliajackson707', 'ameliaj@example.com', 'Moderator', 'Active'),
        createData('Henry', 'White', 'henrywhite808', 'henryw@example.com', 'Admin', 'Inactive'),
        createData('Avery', 'Lee', 'averylee909', 'averyl@example.com', 'User', 'Active'),

    ];

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{maxHeight: 440}}>
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
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                // onClick={() => handleUpdate(row.id)}
                                            >
                                                Update
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}


export default UserTable;