import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Grid2,
    Paper,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Box,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Stack,
} from "@mui/material";
import Signature from "./Signature.jsx";
import {useUser} from "./context/UserContext";
import api from "../services/api";

const SsnChange = ({formData: propFormData, mode = "edit"}) => {
    const {user} = useUser();
    const navigate = useNavigate();

    const isViewOnly = mode === "view";

    // Function to open the dialog
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    // Function to close the dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Form data state
    const defaultFormData = {
        user: user?.id || "",
        signed_on: new Date().toISOString().split("T")[0],
        status: "draft",
        data: {
            name: user ? `${user.first_name} ${user.last_name}` : "",
            firstName: user.first_name,
            middleName: "",
            lastName: user.last_name,
            type: "SSN",
            required_signatures: 0,
            peopleSoftId: "",
            sectionA: false,
            sectionB: false,            
            marriageDivorce: false,
            courtOrder: false,
            correctionOfError: false,
            fromFirstName: "",
            fromMiddleName: "",
            fromLastName: "",
            fromSuffix: "",
            toFirstName: "",
            toMiddleName: "",
            toLastName: "",
            toSuffix: "",
            correctionOfError: false,
            additionOfSsnToUniversityRecords: false,
            fromSsn: "",
            toSsn: "",
            password: "",
            signature: "",
        },
    }

    const [formData, setFormData] = useState(propFormData || defaultFormData);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setFormData((prevState) => {
            // Determine new value to be updated
            const newValue = type === "checkbox" ? checked : value;

            // Update field if it exists in data
            if (name in prevState.data) {
                return {
                    ...prevState,
                    data: {
                        ...prevState.data,
                        [name]: newValue,
                    },
                };
            }

            // otherwise update root-level field
            return {
                ...prevState,
                [name]: newValue,
            };
        });
    };

    // Handle form submit
    const handleSubmit = async (status) => {
        // Update formData
        const updatedFormData = {...formData, status};
        setFormData(updatedFormData);

        try {
            if (
                !updatedFormData.data.firstName ||
                !updatedFormData.data.lastName ||
                !updatedFormData.data.peopleSoftId
            ) {
                alert("Please fill in your name and PeopleSoft ID");
                return;
            }
            const response = await api.post("/forms/", updatedFormData);

            if (response.status === 200 || response.status === 201) {
                alert("Form submitted successfully!");
                navigate("/my-forms"); // Navigate to success page
            } else {
                throw new Error("Server responded with an error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }

        console.log("Data being sent to the post request: ", updatedFormData);
    };

    const handleSave = (signatureData) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            data: {
                ...prevFormData.data,
                signature: signatureData
            }
        }));

        handleClose();
    };

    return (
        <Grid2
            container
            justifyContent={"center"}
            alignItems={"center"}
            p={4}
            sx={{minHeight: "fit-content"}}
        >
            <Paper sx={{width: "100%", padding: 10, position: "relative"}}>
                <Typography
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        fontWeight: "bold",
                        p: 3,
                        fontSize: 14,
                    }}
                >
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="h4" align="center">
                        Name and/or Social Security Number Change
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                    University of Houston | Office of the University Registrar <br />
                    Houston, Texas 77204-2027 | (713) 743-1010, option 7
                    </Typography>
                </Box>
                <form onSubmit={(e) => e.preventDefault()}>

                    <FormControl fullWidth margin={"normal"}>
                    <Typography variant="h6" gutterBottom>
                    *Student Name (as listed on university record)
                    </Typography>
                        <Box sx={{ display: 'flex', pt: 3 }}>
                        <Typography>
                                First Name: <br /> 
                                <TextField
                                    name="firstName"
                                    onChange={handleChange}
                                    value={formData.data.firstName}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                            </Typography>
                            <Typography>
                                Middle Name: <br /> 
                                <TextField
                                    name="middleName"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                            </Typography>                            <Typography>
                                Last Name: <br /> 
                                <TextField
                                    name="lastName"
                                    onChange={handleChange}
                                    value={formData.data.lastName}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                            </Typography>

                        </Box>
                        <Box sx={{ display: 'flex', pt: 3 }}>
                        <Typography variant = "h6">
                                myUH ID: <br /> 
                                <TextField
                                    name="peopleSoftId"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                            </Typography>
                            <Box
                            sx={{display: "flex", flexDirection: "column"}}
                        >
                            <Typography variant="h6">
                                *What are you requesting to add or update?
                            </Typography>
                            <FormControlLabel
                            checked={formData.data.sectionA}
                            sx={{pl: 10, pt: 0.5}}
                            control={<Checkbox/>}
                            name="sectionA"
                            label="Update Name (Complete Section A)"
                            onChange={handleChange}
                            disabled={isViewOnly}
                        />
                            <FormControlLabel
                                checked={formData.data.sectionB}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                name="sectionB"
                                label="Update/Add Social Security Number (Complete Section B)"
                                onChange={handleChange}
                                disabled={isViewOnly}
                            />                            

                        </Box>
                        </Box>
                        <Box>
                            <Typography variant = "h6" style={{ textDecoration: 'underline' }}>Section A: Student Name Change</Typography>
                            <Typography padding="10px">
                                The University of Houston record of your name was originally taken from your application for admission and may be changed if:
                                <br /><br />1. You have married, remarried, or divorced (a copy of marriage license or portion of divorce decree indicating new name must be
                                provided)
                                <br />2. You have changed your name by court order (a copy of the court order must be provided)
                                <br />3. Your legal name is listed incorrectly and satisfactory evidence exists for its correction (driver license, state ID, birth certificate,
                                valid passport, etc., must be provided)
                                <br /><br />NOTE: A request to omit a first or middle name or to reverse the order of the first and middle names cannot be honored unless
                                accompanied by appropriate documentation. 
                                <span style={{ textDecoration: 'underline',fontWeight: 'bold'  }}> All documents must also be submitted with a valid government-issued photo ID (such
                                    as a driver license, passport, or military ID). </span>
                            </Typography>
                        </Box>

                        <Box paddingTop={3}>
                            <Typography style={{ textDecoration: 'underline',fontWeight: 'bold'  }}>
                            Please print and complete the following information: 
                            </Typography>
                            <Typography>
                            I request that my legal name be changed and reflected on University of Houston records as listed below: 
                            </Typography>

                            <Box display="flex">
                                <Typography>Check reason for name change request:</Typography>
                                
                                <FormControlLabel
                                checked={formData.data.registrar}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                name="marriageDivorce"
                                label="Marriage/Divorce"
                                onChange={handleChange}
                                disabled={isViewOnly}
                            />                                 
                            <FormControlLabel
                            checked={formData.data.registrar}
                            sx={{pl: 10, pt: 0.5}}
                            control={<Checkbox/>}
                            name="courtOrder"
                            label="Court order"
                            onChange={handleChange}
                            disabled={isViewOnly}
                        />                                 
                        <FormControlLabel
                        checked={formData.data.registrar}
                        sx={{pl: 10, pt: 0.5}}
                        control={<Checkbox/>}
                        name="correctionOfError"
                        label="Correction of error"
                        onChange={handleChange}
                        disabled={isViewOnly}
                    />
                    </Box>
                    <Box display="flex">
                    <Typography>
                            FROM: First name<br /> 
                            <TextField
                                    name="fromFirstName"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                        </Typography>                         
                        <Typography>
                            Middle name<br /> 
                            <TextField
                                    name="fromMiddleName"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                        </Typography>                         
                        <Typography>
                            Last name<br /> 
                            <TextField
                                    name="fromLastName"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                        </Typography>   
                        <Typography>
                            Suffix<br /> 
                            <TextField
                                    name="fromSuffix"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                        </Typography>   

                    </Box>
                    <Box display="flex">
                    <Typography>
                            TO: First name<br /> 
                            <TextField
                                    name="toFirstName"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                        </Typography>                         
                        <Typography>
                            Middle name<br /> 
                            <TextField
                                    name="toMiddleName"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                        </Typography>                         
                        <Typography>
                            Last name<br /> 
                            <TextField
                                    name="toLastName"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                        </Typography>   
                        <Typography>
                            Suffix<br /> 
                            <TextField
                                    name="toSuffix"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                        </Typography>   

                    </Box>

                </Box>
                <Box>
                <Typography variant = "h6" style={{ textDecoration: 'underline' }}>Section B: Student Social Security Number Change</Typography>
                <Typography>
                    The University of Houston record of your Social Security Number was originally taken from your application for admission and
                    may be changed only if the student has obtained a new social security number or an error was made. In either case, the student
                    must provide a copy of the Social Security Card.  
                    <span style={{ textDecoration: 'underline',fontWeight: 'bold'  }}> The Social Security card must include the student's signature and must be
                    submitted with a valid government-issued photo ID (such as a driver license, passport, or military ID).</span> 
                </Typography>
                </Box>
                <Box paddingTop={3}>
                    <Typography><div style={{ textDecoration: 'underline',fontWeight: 'bold'  }}>Please print and complete the following information: </div>I request that my Social Security Number be changed and reflected on
                    University of Houston records as listed below:</Typography>
                    <Box display="flex" paddingTop={2}>
                            <Typography>Check reason for Social Security Number change request:</Typography>
                                                       
                            <FormControlLabel
                            checked={formData.data.registrar}
                            sx={{pl: 10, pt: 0.5}}
                            control={<Checkbox/>}
                            name="correctionOfError"
                            label="Correction of error"
                            onChange={handleChange}
                            disabled={isViewOnly}
                        />                                 
                        <FormControlLabel
                        checked={formData.data.registrar}
                        sx={{pl: 10, pt: 0.5}}
                        control={<Checkbox/>}
                        name="additionOfSsnToUniversityRecords"
                        label="Addition of SSN to university records"
                        onChange={handleChange}
                        disabled={isViewOnly}
                    />
                    </Box>
                    <Box display="flex">
                    <Typography>
                            FROM:<br /> 
                            <TextField
                                    name="fromSsn"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                        </Typography>
                        <Typography>
                            To:<br /> 
                            <TextField
                                    name="toSsn"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                        </Typography>
                    </Box>

                </Box>
                <Typography paddingTop={3}>
                    I authorize the University of Houston Main Campus to make the updates/changes to my student record as
                    requested above.
                    </Typography>
                <Box
                            component="form"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                "& .MuiTextField-root": {
                                    m: 1,
                                    flexGrow: 1,
                                },
                                alignItems: "center",
                                pt: 5,
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            
                            <TextField
                                variant="outlined"
                                margin="normal"
                                onChange={handleChange}
                                sx={{
                                    marginRight: 2,
                                }}
                                disabled={isViewOnly}
                            />
                            <Button
                                variant="outlined"
                                onClick={() => handleOpen()}
                                sx={{
                                    fontSize: "13px",
                                    width: "10%",
                                    paddingRight: "20px",
                                    marginLeft: 1,
                                    marginRight: 5,
                                    height: "50px",
                                    backgroundImage: formData.data.signature
                                        ? `url(${formData.data.signature})`
                                        : 'none',
                                    backgroundSize: "cover",
                                    backgroundPosition: "center top",
                                }}
                                disabled={isViewOnly}
                            >
                                {formData.data.signature ? (
                                    <Box sx={{
                                        paddingTop: "50px",
                                    }}>
                                        {/* Small label below the signature */}
                                        <span
                                            style={{fontSize: "10px", color: "gray"}}>Signature</span>
                                    </Box>
                                ) : (
                                    "Upload Signature"
                                )}
                            </Button>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Signature</DialogTitle>
                                <DialogContent>
                                    <Signature
                                        id="Student"
                                        onSave={handleSave}
                                    ></Signature>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={handleClose}
                                        color="primary"
                                    >
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            
                            <Typography
                                variant="h6"
                                marginLeft={3}
                                name="signed_on"
                                type="date"
                                sx={{
                                    flexGrow: 1,
                                }}
                            >
                                Date: {formData.signed_on}
                            </Typography>
                        </Box>
                        {
                            !isViewOnly && (
                                <Stack
                                    spacing={2}
                                    mt={2}
                                    direction={"row"}
                                    sx={{
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        type="button"
                                        color="success"
                                        onClick={() => handleSubmit("draft")}
                                        disabled={isViewOnly}
                                        sx={{
                                            marginTop: 2,
                                            display: "inline-block !important",
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        disabled={isViewOnly}
                                        onClick={() => handleSubmit("submitted")}
                                        sx={{
                                            marginTop: 2,
                                            display: "inline-block !important",
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Stack>
                            )
                        }
                      
                    <Typography sx={{ fontSize: 13 }}>
                    "State law requires that you be informed of the following: (1) with few exceptions, you are entitled on request to be informed about the information the University collects about you by use of this form; (2) under
sections 552.021 and 552.023 of the Government Code, you are entitled to receive and review the information; and (3) under section 559.004 of the Government Code, you are entitled to have the University correct
information about you that is incorrect.
                    </Typography>
                    </FormControl>
                </form>
            </Paper>
        </Grid2>
    );
};

export default SsnChange;
