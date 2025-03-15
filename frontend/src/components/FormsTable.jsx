import React, {useState} from 'react';
import {TableRow, TableCell, Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import ReduceCourseLoadForm from "./ReduceCourseLoadForm.jsx";
import Login from "./Login.jsx";

const columns = [
    {id: 'applicant_name', label: 'Applicant Name', minWidth: 170},
    {id: 'from', label: 'Form', minWidth: 170},
    {id: 'status', label: 'Status', minWidth: 170},
    {id: 'action', label: 'Action', minWidth: 150},
];

// Sample data
const data = [
    {firstName: 'John', lastName: 'Doe', from: 'Form A', status: 'Active'},
    {firstName: 'Jane', lastName: 'Smith', from: 'Form B', status: 'Pending'},
];

const YourTableComponent = () => {
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);


    const handleEdit = (row) => {
        setCurrentRow(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentRow(null);
    };

    function handleApprove(row) {
        
    }

    function handleReject(row) {
        
    }

    return (
        <>
            <TableRow>
                {columns.map((column) => (
                    <TableCell key={column.id} style={{minWidth: column.minWidth}}>
                        {column.label}
                    </TableCell>
                ))}
            </TableRow>

            {data.map((row, index) => (
                <TableRow key={index}>
                    <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
                    <TableCell>{row.from}</TableCell>
                    <TableCell>{row.status}</TableCell>

                    <TableCell>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEdit(row)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleApprove(row)}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleReject(row)}
                        >
                            Reject
                        </Button>
                    </TableCell>
                </TableRow>
            ))}

            <Dialog open={open} onClose={handleClose}
                    sx={{
                        '& .MuiDialog-paper': {
                            width: '80%',
                            maxWidth: '90%',
                        },
                    }}>
                <DialogTitle>Edit {currentRow?.firstName} {currentRow?.lastName}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
                <DialogContent>
                    {currentRow?.from === 'Form A' && <ReduceCourseLoadForm handleClose={handleClose}/>}
                    {currentRow?.from === 'Form B' && <Login handleClose={handleClose}/>}
                </DialogContent>

            </Dialog>
        </>
    );
};

export default YourTableComponent;
