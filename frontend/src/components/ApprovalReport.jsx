import React, {useState, useEffect} from "react";
import {
    TableRow,
    TableCell,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    CircularProgress,
    Alert,
    Box,
    Typography,
    TablePagination, Grid2, Card, CardContent, TextField,
} from "@mui/material";
import api from "../services/api.js";

const columns = [
    {id: "applicant_name", label: "Applicant Name", minWidth: 170},
    {id: "Form", label: "Form", minWidth: 170},
    {id: "status", label: "Status", minWidth: 170},
    {id: "signed_on", label: "Date Submitted", minWidth: 170},
    {id: "unit", label: "Unit", minWidth: 150},
    {id: "approval_step", label: "Approval Steps", minWidth: 150},
];

const ApprovalReport = () => {
    const [data, setData] = useState({
        total_forms: 0,
        by_status: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [filters, setFilters] = useState({
        status: '',
        unit: '',
        form_type: '',
        date_from: '',
        date_to: ''
    });

    const fetchFormData = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                include_details: 'true',
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value) // remove empty values
                )
            }).toString();

            const response = await api.get(`/reports/?${queryParams}`);
            const data = response.data;
            setData(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching forms report: ", error);
            setError("Failed to load forms report. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchFormData();
    }, []);


    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calculate paginated data
    const getPaginatedData = () => {
        return data.forms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    };

    return (
        <>
            <Typography variant="h4" sx={{mb: 3}} align="center">
                Approval Forms Reports
            </Typography>
            <Box sx={{
                p: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
            }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress/>
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <Grid2 container spacing={2}>
                        <Grid2 item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">Total Forms</Typography>
                                    <Typography variant="h4" color="primary">
                                        {data.total_forms}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Submitted Forms:
                                    </Typography>
                                    <Typography variant="h5" color="primary">
                                        {data.by_status.submitted}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Rejected Forms:
                                    </Typography>
                                    <Typography variant="h5" color="error">
                                        {data.by_status.rejected}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Accepted Forms:
                                    </Typography>
                                    <Typography variant="h5" color="success">
                                        {data.by_status.accepted}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Draft Forms:
                                    </Typography>
                                    <Typography variant="h5" color="black">
                                        {data.by_status.draft}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                    </Grid2>
                )}
            </Box>
            <Box sx={{
                p: 3,
                backgroundColor: "#fff",
                borderRadius: 2,
            }}>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Status"
                            select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            SelectProps={{native: true}}
                        >
                            <option value="">All</option>
                            <option value="draft">Draft</option>
                            <option value="submitted">Submitted</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </TextField>
                    </Grid2>
                    <Grid2 item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Unit"
                            value={filters.unit}
                            onChange={(e) => setFilters({...filters, unit: e.target.value})}
                        />
                    </Grid2>
                    <Grid2 item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Form Type"
                            value={filters.form_type}
                            onChange={(e) => setFilters({...filters, form_type: e.target.value})}
                        />
                    </Grid2>
                    <Grid2 item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="From Date"
                            type="date"
                            InputLabelProps={{shrink: true}}
                            value={filters.date_from}
                            onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                        />
                    </Grid2>
                    <Grid2 item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="To Date"
                            type="date"
                            InputLabelProps={{shrink: true}}
                            value={filters.date_to}
                            onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                        />
                    </Grid2>
                    <Grid2 item xs={12} sm={6} md={3}>
                        <Box display="flex" alignItems="center" height="100%">
                            <button
                                onClick={fetchFormData}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: 'pointer'
                                }}
                            >
                                Search
                            </button>
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>
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
                            ) : data.forms.length > 0 ? (
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
                                        <TableCell>{form.user}</TableCell>
                                        <TableCell>{form.type}</TableCell>
                                        <TableCell>{form.status}</TableCell>
                                        <TableCell>{form.signed_date}</TableCell>
                                        <TableCell>{form.unit}</TableCell>
                                        <TableCell>{form.approval_steps}</TableCell>
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
                    {/* Add TablePagination component */}
                    {!loading && data.forms.length > 0 && (
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data.forms.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </TableContainer>
            </Box>
        </>
    );
};

export default ApprovalReport;