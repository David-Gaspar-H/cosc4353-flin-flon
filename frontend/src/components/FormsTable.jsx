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
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid2, FormControl, InputLabel, Select, MenuItem, OutlinedInput, ListItemText
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import ReduceCourseLoadForm from "./ReduceCourseLoadForm.jsx";
import ResponsiveAppBar from "./ResponsiveAppBar.jsx";
import Box from "@mui/material/Box";
import Footer from "./Footer.jsx";
import FerpaForm from "./FerpaForm.jsx";

const columns = [
    {id: "applicant_name", label: "Applicant Name", minWidth: 170},
    {id: "from", label: "Form", minWidth: 170},
    {id: "status", label: "Status", minWidth: 170},
    {id: "dateSubmitted", label: "Date Submitted", minWidth: 170},
    {id: "action", label: "Action", minWidth: 150},
];

// Sample data
const initialData = [
    {firstName: "John", lastName: "Doe", from: "Reduce Course Load", dateSubmitted: "2025-03-12", status: "Approved"},
    {firstName: "Jane", lastName: "Smith", from: "FERPA", dateSubmitted: "2025-03-12", status: "Pending"},
    {firstName: "Michael", lastName: "Johnson", from: "Reduce Course Load", dateSubmitted: "2025-03-10", status: "Rejected"},
    {firstName: "Emily", lastName: "Williams", from: "FERPA", dateSubmitted: "2025-03-08", status: "Approved"},
    {firstName: "David", lastName: "Brown", from: "Reduce Course Load", dateSubmitted: "2025-03-05", status: "Pending"},
    {firstName: "David", lastName: "Brown", from: "Reduce Course Load", dateSubmitted: "2025-03-05", status: "Draft"},
];


const formTypes = [
    'Reduce Course Load',
    'FERPA',
];

const FormsTable = () => {
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [data, setData] = useState(initialData);
    const [filteredData, setFilteredData] = useState(initialData);

    // Filter states
    const [firstNameFilter, setFirstNameFilter] = useState("");
    const [lastNameFilter, setLastNameFilter] = useState("");
    const [startDateFilter, setStartDateFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState("");
    const [formFilter, setFormFilter] = useState([]);
    const [statusFilters, setStatusFilters] = useState({
        Approved: false,
        Pending: false,
        Rejected: false,
        Draft: false,
    });

    // Apply filters whenever filter states change
    useEffect(() => {
        applyFilters();
    }, [firstNameFilter, lastNameFilter, startDateFilter, endDateFilter, formFilter, statusFilters]);

    const applyFilters = () => {
        let filtered = [...data];

        // Filter by first name
        if (firstNameFilter) {
            filtered = filtered.filter(item =>
                item.firstName.toLowerCase().includes(firstNameFilter.toLowerCase())
            );
        }

        // Filter by last name
        if (lastNameFilter) {
            filtered = filtered.filter(item =>
                item.lastName.toLowerCase().includes(lastNameFilter.toLowerCase())
            );
        }

        // Filter by date range
        if (startDateFilter && endDateFilter) {
            filtered = filtered.filter(item => {
                return item.dateSubmitted >= startDateFilter && item.dateSubmitted <= endDateFilter;
            });
        } else if (startDateFilter) {
            filtered = filtered.filter(item => {
                return item.dateSubmitted >= startDateFilter;
            });
        } else if (endDateFilter) {
            filtered = filtered.filter(item => {
                return item.dateSubmitted <= endDateFilter;
            });
        }

        // Filter by form type
        if (formFilter && formFilter.length > 0) {
            filtered = filtered.filter(item =>
                formFilter.includes(item.from)
            );
        }

        // Filter by status
        const activeStatusFilters = Object.keys(statusFilters).filter(key => statusFilters[key]);
        if (activeStatusFilters.length > 0) {
            filtered = filtered.filter(item =>
                activeStatusFilters.includes(item.status)
            );
        }

        setFilteredData(filtered);
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilters(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    };

    const clearFilters = () => {
        setFirstNameFilter("");
        setLastNameFilter("");
        setStartDateFilter("");
        setEndDateFilter("");
        setFormFilter([]);
        setStatusFilters({
            Approved: false,
            Pending: false,
            Rejected: false,
            Draft: false,
        });
    };

    const handleEdit = (row) => {
        setCurrentRow(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentRow(null);
    };

    function handleApprove(row) {
        const updatedData = data.map(item => {
            if (item === row) {
                return {...item, status: "Approved"};
            }
            return item;
        });
        setData(updatedData);
        setFilteredData(updatedData);
    }

    function handleReject(row) {
        const updatedData = data.map(item => {
            if (item === row) {
                return {...item, status: "Rejected"};
            }
            return item;
        });
        setData(updatedData);
        setFilteredData(updatedData);
    }

    function handlePending(row) {
        const updatedData = data.map(item => {
            if (item === row) {
                return {...item, status: "Pending"};
            }
            return item;
        });
        setData(updatedData);
        setFilteredData(updatedData);
    }

    function handleDraft(row) {
        const updatedData = data.map(item => {
            if (item === row) {
                return {...item, status: "Draft"};
            }
            return item;
        });
        setData(updatedData);
        setFilteredData(updatedData);
    }

    const handleFormFilterChange = (event) => {
        const {
            target: {value},
        } = event;
        setFormFilter(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <>
            <ResponsiveAppBar/>
            <Box sx={{p: 3, backgroundColor: "#f5f5f5", borderRadius: 2, minHeight:"100vh"}}>
                {/* Filter Panel */}
                <Paper elevation={2} sx={{p: 2, mb: 2, borderRadius: 2}}>
                    <Accordion defaultExpanded={false}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="filter-panel-content"
                            id="filter-panel-header"
                        >
                            <Typography variant="h6" sx={{display: 'flex', alignItems: 'center'}}>
                                <FilterAltIcon sx={{mr: 1}}/> Filter Options
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid2 container spacing={2}>
                                <Grid2 xs={12} sm={6} md={3}>
                                    <TextField
                                        label="First Name"
                                        variant="outlined"
                                        fullWidth
                                        value={firstNameFilter}
                                        onChange={(e) => setFirstNameFilter(e.target.value)}
                                        size="small"
                                    />
                                </Grid2>
                                <Grid2 xs={12} sm={6} md={3}>
                                    <TextField
                                        label="Last Name"
                                        variant="outlined"
                                        fullWidth
                                        value={lastNameFilter}
                                        onChange={(e) => setLastNameFilter(e.target.value)}
                                        size="small"
                                    />
                                </Grid2>
                                <Grid2 xs={12} sm={6} md={3}>
                                    <TextField
                                        label="From Date"
                                        variant="outlined"
                                        fullWidth
                                        type="date"
                                        value={startDateFilter}
                                        onChange={(e) => setStartDateFilter(e.target.value)}
                                        size="small"
                                    />
                                </Grid2>
                                <Grid2 xs={12} sm={6} md={3}>
                                    <TextField
                                        label="To Date"
                                        variant="outlined"
                                        fullWidth
                                        type="date"
                                        value={endDateFilter}
                                        onChange={(e) => setEndDateFilter(e.target.value)}
                                        size="small"
                                    />
                                </Grid2>
                                <Grid2 xs={12} sm={6} md={3}>
                                    <FormControl fullWidth sx={{width: '200px'}} size="small">
                                        <InputLabel id="form-type-select-label">Form Type</InputLabel>
                                        <Select
                                            labelId="form-type-select-label"
                                            id="form-type-select"
                                            multiple
                                            value={formFilter}
                                            onChange={handleFormFilterChange}
                                            input={<OutlinedInput label="Form Type"/>}
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {formTypes.map((formType) => (
                                                <MenuItem key={formType} value={formType}>
                                                    <Checkbox checked={formFilter.indexOf(formType) > -1}/>
                                                    <ListItemText primary={formType}/>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid2>
                                <Grid2 xs={12}>
                                    <Typography variant="subtitle1" sx={{mb: 1}}>Status: </Typography>
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={statusFilters.Approved}
                                                    onChange={() => handleStatusFilterChange("Approved")}
                                                    color="primary"
                                                />
                                            }
                                            label="Approved"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={statusFilters.Pending}
                                                    onChange={() => handleStatusFilterChange("Pending")}
                                                    color="primary"
                                                />
                                            }
                                            label="Pending"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={statusFilters.Rejected}
                                                    onChange={() => handleStatusFilterChange("Rejected")}
                                                    color="primary"
                                                />
                                            }
                                            label="Rejected"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={statusFilters.Draft}
                                                    onChange={() => handleStatusFilterChange("Draft")}
                                                    color="primary"
                                                />
                                            }
                                            label="Draft"
                                        />
                                    </FormGroup>
                                </Grid2>
                                <Grid2 xs={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ClearIcon/>}
                                        onClick={clearFilters}
                                        sx={{mr: 1}}
                                    >
                                        Clear Filters
                                    </Button>
                                </Grid2>
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>
                </Paper>

                {/* Table */}
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
                            {filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <TableRow key={index} sx={{
                                        "&:nth-of-type(even)": {
                                            backgroundColor: "#f5f5f5",
                                        },
                                        "&:hover": {
                                            backgroundColor: "#e0e0e0",
                                            cursor: "pointer",
                                        },
                                    }}>
                                        <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
                                        <TableCell>{row.from}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>{row.dateSubmitted}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEdit(row)}
                                                size="small"
                                                sx={{mr: 1}}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleApprove(row)}
                                                size="small"
                                                sx={{mr: 1}}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleReject(row)}
                                                size="small"
                                                sx={{mr: 1}}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                onClick={() => handlePending(row)}
                                                size="small"
                                                sx={{mr: 1}}
                                            >
                                                Pending
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleDraft(row)}
                                                size="small"
                                            >
                                                Draft
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        No records found matching your filters
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
                        Edit {currentRow?.firstName} {currentRow?.lastName}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                    <DialogContent>
                        {currentRow?.from === "Reduce Course Load" && (
                            <ReduceCourseLoadForm handleClose={handleClose}/>
                        )}
                        {currentRow?.from === "FERPA" && (
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