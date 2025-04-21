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

const FerpaForm = ({formData: propFormData, mode = "edit"}) => {
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
        type: "Ferpa",
        data: {
            name: user ? `${user.first_name} ${user.last_name}` : "", // capture from user session
            required_signatures: 0,
            registrar: false,
            scholarships: false,
            financialAid: false,
            undergradScholars: false,
            universityAdvancement: false,
            deanOfStudentOffice: false,
            otherOfficials: false,
            otherOfficialsText: "",
            advising: false,
            academicRecords: false,
            universityRecords: false,
            billingFinancialAid: false,
            disciplinary: false,
            gradesTranscripts: false,
            housing: false,
            photos: false,
            scholarshipsHonors: false,
            otherCategories: false,
            otherCategoriesText: "",
            releaseTo: "",
            family: false,
            educationalInstitutions: false,
            honorAward: false,
            employer: false,
            publicOrMedia: false,
            otherReleaseTo: false,
            otherReleaseToText: "",
            password: "",
            peopleSoftId: "",
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
                !updatedFormData.data.name ||
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
                    Form No. OGC-SF-2006-02
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
                        AUTHORIZATION TO RELEASE EDUCATIONAL RECORDS
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        Family Educational Rights and Privacy Act of 1974 as
                        Amended (FERPA)
                    </Typography>
                </Box>
                <form onSubmit={(e) => e.preventDefault()}>
                    <FormControl fullWidth margin={"normal"}>
                        <Box paddingTop={3}>
                            <Typography>
                                I,
                                <TextField
                                    value={formData.data.name}
                                    name="name"
                                    onChange={handleChange}
                                    size="small"
                                    sx={{
                                        width: "150px",
                                        marginLeft: 1,
                                        marginRight: 1,
                                    }}
                                    disabled={isViewOnly}
                                />
                                hereby voluntarily authorize officials in the
                                University of Houston - Main identified below to
                                disclose personally identifiable information
                                from my educational records. (Please check the
                                box or boxes that apply):
                            </Typography>
                        </Box>
                        <Box
                            paddingTop={1}
                            sx={{display: "flex", flexDirection: "column"}}
                        >
                            <FormControlLabel
                                checked={formData.data.registrar}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                name="registrar"
                                label="Office of the University Registrar"
                                onChange={handleChange}
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.scholarships}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Scholarships and Financial Aid"
                                onChange={handleChange}
                                name="scholarships"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.financialAid}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Student Financial Services"
                                onChange={handleChange}
                                name="financialAid"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.undergradScholars}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Undergraduate Scholars @ UH (formally USD)"
                                onChange={handleChange}
                                name="undergradScholars"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.universityAdvancement}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="University Advancement"
                                onChange={handleChange}
                                name="universityAdvancement"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.deanOfStudentOffice}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Dean of Students Office"
                                onChange={handleChange}
                                name="deanOfStudentOffice"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.otherOfficials}
                                sx={{
                                    pl: 10,
                                    pt: 1,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                                control={<Checkbox/>}
                                onChange={handleChange}
                                name="otherOfficials"
                                disabled={isViewOnly}
                                label={
                                    <>
                                        Other (Please Specify)
                                        <TextField
                                            name="otherOfficialsText"
                                            value={
                                                formData.data.otherOfficialsText
                                            }
                                            size="small"
                                            sx={{
                                                width: "150px",
                                                pl: 1,
                                                alignSelf: "center",
                                            }}
                                            onChange={handleChange}
                                            disabled={isViewOnly}
                                        />
                                    </>
                                }
                            />
                        </Box>
                        <Box paddingTop={3}>
                            <Typography>
                                Specifically, I authorize the disclosure of the
                                following information or category of
                                information. (Please check the box or boxes that
                                apply):
                            </Typography>
                        </Box>
                        <Box
                            paddingTop={2}
                            sx={{display: "flex", flexDirection: "column"}}
                        >
                            <FormControlLabel
                                checked={formData.data.advising}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Academic Advising Profile/Information"
                                onChange={handleChange}
                                name="advising"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.academicRecords}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Academic Records"
                                onChange={handleChange}
                                name="academicRecords"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.universityRecords}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="All University Records"
                                onChange={handleChange}
                                name="universityRecords"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.billingFinancialAid}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Billing/Financial Aid"
                                onChange={handleChange}
                                name="billingFinancialAid"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.disciplinary}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Disciplinary"
                                onChange={handleChange}
                                name="disciplinary"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.gradesTranscripts}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Grades/Transcripts"
                                onChange={handleChange}
                                name="gradesTranscripts"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.housing}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Housing"
                                onChange={handleChange}
                                name="housing"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.photos}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Photos"
                                onChange={handleChange}
                                name="photos"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.scholarshipsHonors}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Scholarships and/or Honors"
                                onChange={handleChange}
                                name="scholarshipsHonors"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.otherCategories}
                                onChange={handleChange}
                                name="otherCategories"
                                sx={{
                                    pl: 10,
                                    pt: 1,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                                control={<Checkbox/>}
                                disabled={isViewOnly}
                                label={
                                    <>
                                        Other (Please Specify)
                                        <TextField
                                            name="otherCategoriesText"
                                            value={
                                                formData.data
                                                    .otherCategoriesText
                                            }
                                            size="small"
                                            sx={{
                                                width: "150px",
                                                pl: 1,
                                                alignSelf: "center",
                                            }}
                                            onChange={handleChange}
                                            disabled={isViewOnly}
                                        />
                                    </>
                                }
                            />
                        </Box>
                        <Box paddingTop={3}>
                            <Typography>
                                The information may be released to:
                                <Tooltip
                                    title="Print name(s) of Individual(s) to whom the University may disclose information, comma separated">
                                    <TextField
                                        value={formData.data.releaseTo}
                                        name="releaseTo"
                                        onChange={handleChange}
                                        size="small"
                                        sx={{
                                            width: "700px",
                                            marginLeft: 1,
                                            marginRight: 1,
                                        }}
                                        disabled={isViewOnly}
                                    />
                                </Tooltip>
                                for the purpose of informing:
                            </Typography>
                        </Box>
                        <Box
                            paddingTop={1}
                            sx={{display: "flex", flexDirection: "column"}}
                        >
                            <FormControlLabel
                                checked={formData.data.family}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Family"
                                onChange={handleChange}
                                name="family"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.educationalInstitutions}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Educational Institution"
                                onChange={handleChange}
                                name="educationalInstitutions"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.honorAward}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Honor or Award"
                                onChange={handleChange}
                                name="honorAward"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.employer}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Employer/Prospective Employer"
                                onChange={handleChange}
                                name="employer"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.publicOrMedia}
                                sx={{pl: 10, pt: 0.5}}
                                control={<Checkbox/>}
                                label="Public or Media of Scholarship"
                                onChange={handleChange}
                                name="publicOrMedia"
                                disabled={isViewOnly}
                            />
                            <FormControlLabel
                                checked={formData.data.otherReleaseTo}
                                onChange={handleChange}
                                name="otherReleaseTo"
                                disabled={isViewOnly}
                                sx={{
                                    pl: 10,
                                    pt: 1,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                                control={<Checkbox/>}
                                label={
                                    <>
                                        Other (Please Specify)
                                        <TextField
                                            name="otherReleaseToText"
                                            value={
                                                formData.data.otherReleaseToText
                                            }
                                            onChange={handleChange}
                                            size="small"
                                            sx={{
                                                width: "150px",
                                                pl: 1,
                                                alignSelf: "center",
                                            }}
                                            disabled={isViewOnly}
                                        />
                                    </>
                                }
                            />
                        </Box>
                        <Box
                            pt={5}
                            sx={{display: "flex", flexDirection: "column"}}
                        >
                            <Typography>
                                Please provide a password to obtain information
                                via the phone:
                                <TextField
                                    name="password"
                                    value={formData.data.password}
                                    onChange={handleChange}
                                    disabled={isViewOnly}
                                    sx={{
                                        width: "150px",
                                        pl: 1,
                                    }}
                                    size="small"
                                />
                                . The password should not contain more than ten
                                (10) letters. You must provide the password to
                                the individuals or agencies listed above. The
                                University will not release information to the
                                caller if the caller does not have the password.
                                A new form must be completed to change your
                                password.
                            </Typography>
                            <Typography fontWeight={"bold"} pt={3}>
                                This is to attest that I am a student signing
                                this form. I understand the information may be
                                released orally or in the form of copies of
                                written records, as preferred by the requester.
                                This authorization will remain in effect from
                                the date it is executed until revoked by me, in
                                writing, and delivered to the Department(s)
                                identified above.
                            </Typography>
                        </Box>

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
                                value={formData.data.name}
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
                            <TextField
                                label="PSID"
                                margin="normal"
                                name="peopleSoftId"
                                value={formData.data.peopleSoftId}
                                onChange={handleChange}
                                marginRight={5}
                                disabled={isViewOnly}
                            />
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
                    </FormControl>
                </form>
            </Paper>
        </Grid2>
    );
};

export default FerpaForm;
