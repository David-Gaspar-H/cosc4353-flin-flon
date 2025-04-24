import * as React from "react";
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
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from "@mui/material";

import api from "../services/api";
import { useUser } from "./context/UserContext.jsx";
import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


function ModifyWorkflow() {
	const { user } = useUser();
	const [Workflows, setWorkflows] = useState([]);
	const [units, setUnits] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedWorkflow, setSelectedWorkflow] = useState(null);
	const [defaultSteps, setDefaultSteps] = useState([]);

	const fetchWorkflows = async () => {
		const { data } = await api.get("/workflows/");
		const matched = data.find((workflow) =>
			workflow.steps.some((step) => step.id === user.unit.id)
		);
		setWorkflows([matched]);
	};

    const fetchUnits = async () =>{
		const data = await api.get(`units/`);
		setUnits(data.data); 
    }

	useEffect(() => {
		setLoading(true);
		try {
			fetchWorkflows();
            fetchUnits();
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleEditClick = (workflow) => {
		setSelectedWorkflow(workflow);
		setDefaultSteps(JSON.parse(JSON.stringify(workflow.steps))); // deep clone
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setSelectedWorkflow(null);
	};

    const getNameByUnit = (units, targetId) => {
        const match = units.find(unit => unit.id === targetId);
        return match ? match.name : null;
    };

	const handleSaveWorkflow = async () => {
		try {
			const response = await api.post("workflow/steps/update/", {
				workflow_id: selectedWorkflow.id,
				steps: selectedWorkflow.steps.map((step, index) => ({
					step_number: index + 1,
					approver_unit: step.approver_unit,
					is_optional: step.is_optional,
					approvals_required: step.approvals_required,
				})),
			});
			console.log("Workflow updated:", response.data);
		} catch (error) {
			console.error("Failed to save workflow steps:", error);
		}
	};



	return (
		<Box justifyContent="center" alignItems="center" maxWidth="100%" padding={4}>
			<Paper sx={{ padding: 2 }}>
				<Typography variant="h4" align="center" gutterBottom>
					Modifiable Forms
				</Typography>

				{loading ? (
					<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
						<CircularProgress />
					</Box>
				) : (
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Form ID</TableCell>
									<TableCell>Type</TableCell>
									<TableCell>Origin Unit</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Workflows.map((workflow) => (
									<TableRow key={workflow.id}>
										<TableCell>{workflow.id}</TableCell>
										<TableCell>{workflow.form_type}</TableCell>
										<TableCell>{workflow.origin_unit}</TableCell>
										<TableCell>{workflow.is_active ? "Active" : "Not Active"}</TableCell>
										<TableCell>
											<Button onClick={() => handleEditClick(workflow)}>Edit</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}

				{/* 🔹 Dialog for Editing Workflow */}
				<Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="100%">
					<DialogTitle>Edit Steps</DialogTitle>
					<DialogContent dividers>
						{selectedWorkflow && (
							<>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Step Number</TableCell>
                                                <TableCell>Unit</TableCell>
                                                <TableCell>Optional</TableCell>
                                                <TableCell>Aprovals Required</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedWorkflow.steps.map((step, index) => (
                                                <TableRow key={step.id || index}>
                                                <TableCell>{step.step_number}</TableCell>

                                                {/* Approver Unit Dropdown */}
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                    <Select
                                                        value={step.approver_unit}
                                                        onChange={(e) => {
                                                        const updatedSteps = [...selectedWorkflow.steps];
                                                        updatedSteps[index].approver_unit = e.target.value;
                                                        setSelectedWorkflow({ ...selectedWorkflow, steps: updatedSteps });
                                                        }}
                                                    >
                                                        {units.map((unit) => (
                                                        <MenuItem key={unit.id} value={unit.id}>
                                                            {unit.name}
                                                        </MenuItem>
                                                        ))}
                                                    </Select>
                                                    </FormControl>
                                                </TableCell>

                                                {/* Optional / Required Select */}
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                    <Select
                                                        value={step.is_optional ? "Optional" : "Required"}
                                                        onChange={(e) => {
                                                        const updatedSteps = [...selectedWorkflow.steps];
                                                        updatedSteps[index].is_optional = e.target.value === "Optional";
                                                        setSelectedWorkflow({ ...selectedWorkflow, steps: updatedSteps });
                                                        }}
                                                    >
                                                        <MenuItem value="Required">Required</MenuItem>
                                                        <MenuItem value="Optional">Optional</MenuItem>
                                                    </Select>
                                                    </FormControl>
                                                </TableCell>

                                                {/* Approvals Required Input */}
                                                <TableCell>
                                                    <TextField
                                                    type="number"
                                                    size="small"
                                                    value={step.approvals_required}
                                                    onChange={(e) => {
                                                        const updatedSteps = [...selectedWorkflow.steps];
                                                        updatedSteps[index].approvals_required = parseInt(e.target.value);
                                                        setSelectedWorkflow({ ...selectedWorkflow, steps: updatedSteps });
                                                    }}
                                                    />
                                                </TableCell>

                                                {/* Delete Button */}
                                                <TableCell>
                                                    <Button color="error" onClick={() => {
                                                    const updatedSteps = selectedWorkflow.steps.filter((_, i) => i !== index);
                                                    setSelectedWorkflow({ ...selectedWorkflow, steps: updatedSteps });
                                                    }}>
                                                    Delete
                                                    </Button>
                                                </TableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>

                                    </Table>
                                </TableContainer>
							</>
						)}
					</DialogContent>
                    <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                        const newStep = {
                        id: `temp-${Date.now()}`, // temporary ID to avoid conflicts
                        step_number: selectedWorkflow.steps.length + 1,
                        approver_unit: units[0]?.id || null,
                        is_optional: false,
                        approvals_required: 1,
                        };
                        setSelectedWorkflow({
                        ...selectedWorkflow,
                        steps: [...selectedWorkflow.steps, newStep],
                        });
                    }}
                    >
                    + Add Step
                    </Button>
					<Button
						variant="outlined"
						fullWidth
						color="secondary"
						sx={{ mt: 2 }}
						onClick={() => {
							setSelectedWorkflow({ ...selectedWorkflow, steps: JSON.parse(JSON.stringify(defaultSteps)) });
						}}
					>
						🔁 Back to Default
					</Button>

					<DialogActions>
						<Button onClick={handleDialogClose}>Cancel</Button>
						<Button
							variant="contained"
							onClick={async () => {
								try {
								await api.post(`/workflows/${selectedWorkflow.id}/update/`, {
									id: selectedWorkflow.id,
									name: selectedWorkflow.name,
									form_type: selectedWorkflow.form_type,
									origin_unit: selectedWorkflow.origin_unit,
									is_active: selectedWorkflow.is_active,
									steps: selectedWorkflow.steps.map((step, index) => ({
									id: step.id,  // Optional for backend insert
									step_number: index + 1,
									role_required: step.role_required || "admin",  // Or your logic
									approver_unit: step.approver_unit,
									is_optional: step.is_optional,
									approvals_required: step.approvals_required,
									})),
								});

								handleDialogClose();
								} catch (error) {
								console.error("Failed to update workflow:", error);
								}
							}}
							>
							Save
							</Button>

					</DialogActions>
                    
				</Dialog>
			</Paper>
		</Box>
	);
}

export default ModifyWorkflow;
