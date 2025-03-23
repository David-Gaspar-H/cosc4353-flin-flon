import React, {useState, useEffect} from "react";
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
} from "@mui/material";
import ReduceCourseLoadForm from "./ReduceCourseLoadForm.jsx";
import Footer from "./Footer.jsx";
import FerpaForm from "./FerpaForm.jsx";
import api from "../services/api.js";

const columns = [
    {id: "applicant_name", label: "Applicant Name", minWidth: 170},
    {id: "status", label: "Status", minWidth: 170},
    {id: "signed_on", label: "Date Submitted", minWidth: 170},
    {id: "action", label: "Action", minWidth: 150},
];

// Form types
const formTypes = ["Reduce Course Load", "FERPA"];

const FormsTable = () => {
    const [open, setOpen] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState(null);
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch form data
    const fetchFormData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/forms/");
            setFormData(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching forms: ", error);
            setError("Failed to load forms. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFormData();
    }, []); // Empty dependency array ensures this runs only once

    const handleClose = () => {
        setOpen(false);
        setSelectedFormId(null);
    };

    const handleApprove = async (form) => {
        setActionLoading(true);
        form.status = "accepted";
        try {
            const response = await api.post(`/forms/`, form);

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
        setActionLoading(true);
        form.status = "rejected";
        try {
            const response = await api.post(`/forms/`, form);

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

    return (
        <>
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
                    <Alert severity="error" sx={{mb: 2}}>
                        {error}
                    </Alert>
                )}

                <TableContainer
                    component={Paper}
                    elevation={3}
                    sx={{borderRadius: 2}}
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
                                    <TableCell colSpan={columns.length} align="center" sx={{py: 4}}>
                                        <CircularProgress/>
                                        <Box sx={{mt: 1}}>Loading forms...</Box>
                                    </TableCell>
                                </TableRow>
                            ) : formData.length > 0 ? (
                                formData.map((form, index) => (
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
                                        <TableCell>{`${form.firstName} ${form.lastName}`}</TableCell>
                                        <TableCell>{form.status}</TableCell>
                                        <TableCell>{form.signed_on}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleApprove(form)}
                                                size="small"
                                                sx={{mr: 1}}
                                                disabled={actionLoading}
                                            >
                                                {actionLoading ? "Processing..." : "Approve"}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleReject(form)}
                                                size="small"
                                                sx={{mr: 1}}
                                                disabled={actionLoading}
                                            >
                                                {actionLoading ? "Processing..." : "Reject"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        No records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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
                        Edit {selectedFormId?.firstName} {selectedFormId?.lastName}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                    <DialogContent>
                        {selectedFormId?.from === "Reduce Course Load" && (
                            <ReduceCourseLoadForm handleClose={handleClose}/>
                        )}
                        {selectedFormId?.from === "FERPA" && (
                            <FerpaForm handleClose={handleClose}/>
                        )}
                    </DialogContent>
                </Dialog>
            </Box>
            <Footer/>
        </>
    );
};

export default FormsTable;