import React, {useState} from "react";
import {
    FormControl,
    TextField,
    Button,
    Paper,
    Typography,
    Grid2,
    Link,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import api from "../services/api";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Signature from "./Signature.jsx";
import Stack from "@mui/material/Stack";
import {useUser} from "./context/UserContext";

const ReduceCourseLoadForm = () => {
    // Get system date to prefill form field
    const currentDate = new Date();
    const [open, setOpen] = useState(false);
    const [activeSignatureId, setActiveSignatureId] = useState(null);
    const {user} = useUser();
    const navigate = useNavigate();

    // Form data state with all form fields
    const [formData, setFormData] = useState({
        user: user ? user.id : null,
        name: user ? `${user.first_name} ${user.last_name}` : "",
        peopleSoftId: user?.psid || "",
        status: "",
        signed_on: new Date().toISOString().split("T")[0],
        data: {
            required_signatures: 2,
            // Academic Difficulty Section
            initialAdjustmentIssues: false,
            iaiExplanation: "",
            improperCoursePlacement: false,

            // Courses and Professors
            classes: [
                {class: "", professor: "", signature: null, date: ""},
                {class: "", professor: "", signature: null, date: ""},
                {class: "", professor: "", signature: null, date: ""}
            ],

            // Medical Reason Section
            medicalReason: false,
            medicalLetterAttached: false,

            // Final Semester Section
            finalSemester: false,
            finalSemesterHours: 0,

            // Concurrently Enrolled Section
            concurrentlyEnrolled: false,
            hoursUH: 0,
            hoursOtherSchool: 0,
            schoolName: "",

            // Semester Details
            fallSemester: false,
            springSemester: false,
            fallYear: "",
            springYear: "",


            // Courses to Drop
            courseOne: "",
            courseTwo: "",
            courseThree: "",

            // Hours after Drop
            remainingHours: 0,
            remainingFallYearChecked: false,
            remainingFallYear: "",
            remainingSpringYearChecked: false,
            remainingSpringYear: "",

            // Signatures
            studentSignature: null,
            studentSignatureDate: new Date().toISOString().split("T")[0],

            advisorName: "",
            advisorSignature: null,
            advisorSignatureDate: "",

            issoName: "",
            issoSignature: null,
            issoSignatureDate: ""
        }

    });

    // Function to open the signature dialog
    const handleOpenSignature = (signatureId) => {
        setActiveSignatureId(signatureId);
        setOpen(true);
    };

    // Function to close the dialog
    const handleClose = () => {
        setOpen(false);
        setActiveSignatureId(null);
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            data: {
                ...formData.data,
                [e.target.name]: e.target.checked
            }
        });
    };

    // Handle text input changes
    const handleInputChange = (e) => {
        // Check if the field is a top-level field or nested in data
        if (e.target.name === 'name' || e.target.name === 'peopleSoftId' || e.target.name === 'date') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        } else {
            setFormData({
                ...formData,
                data: {
                    ...formData.data,
                    [e.target.name]: e.target.value
                }
            });
        }
    };

    // Handle class and professor data changes
    const handleClassChange = (index, field, value) => {
        const updatedClasses = [...formData.data.classes];
        updatedClasses[index] = {...updatedClasses[index], [field]: value};
        setFormData({
            ...formData,
            data: {
                ...formData.data,
                classes: updatedClasses
            }
        });
    };

    // Handle signature save from Signature component
    const handleSignatureSave = (signatureData) => {
        // Update the appropriate signature field based on activeSignatureId
        switch (activeSignatureId) {
            case "student":
                setFormData({
                    ...formData,
                    data: {
                        ...formData.data,
                        studentSignature: signatureData
                    }
                });
                break;
            case "advisor":
                setFormData({
                    ...formData,
                    data: {
                        ...formData.data,
                        advisorSignature: signatureData
                    }
                });
                break;
            case "isso":
                setFormData({
                    ...formData,
                    data: {
                        ...formData.data,
                        issoSignature: signatureData
                    }
                });
                break;
            case "professor1":
                const updatedClasses1 = [...formData.data.classes];
                updatedClasses1[0] = {...updatedClasses1[0], signature: signatureData};
                setFormData({
                    ...formData,
                    data: {
                        ...formData.data,
                        classes: updatedClasses1
                    }
                });
                break;
            case "professor2":
                const updatedClasses2 = [...formData.data.classes];
                updatedClasses2[1] = {...updatedClasses2[1], signature: signatureData};
                setFormData({
                    ...formData,
                    data: {
                        ...formData.data,
                        classes: updatedClasses2
                    }
                });
                break;
            case "professor3":
                const updatedClasses3 = [...formData.data.classes];
                updatedClasses3[2] = {...updatedClasses3[2], signature: signatureData};
                setFormData({
                    ...formData,
                    data: {
                        ...formData.data,
                        classes: updatedClasses3
                    }
                });
                break;
            default:
                console.warn("Unknown signature ID:", activeSignatureId);
        }

        handleClose();
    };

    // Submit handler for form submission
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        const submitData = {...formData, status: 'submitted'};
        setFormData(submitData);

        try {
            if (!formData.name || !formData.peopleSoftId) {
                alert("Please fill in your name and PeopleSoft ID");
                return;
            }

            const response = await api.post('/forms/', submitData);

            if (response.status === 200 || response.status === 201) {
                alert('Form submitted successfully!');
                navigate('/my-forms'); // Navigate to success page
            } else {
                throw new Error('Server responded with an error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again.');
        }
    };

    // Save as draft handler
    const handleSave = (e) => {
        if (e) e.preventDefault();

        const draftData = {...formData, status: 'draft'};
        setFormData(draftData);
        try {
            api.post('/forms/', draftData)
                .then(response => {
                    if (response.status === 200 || response.status === 201) {
                        alert('Form saved as draft successfully!');
                    } else {
                        throw new Error('Server responded with an error');
                    }
                })
                .catch(error => {
                    throw error;
                });
        } catch (error) {
            console.error('Error saving draft:', error);
            alert('Failed to save draft. Please try again.');
        }
    };

    return (
        <Grid2
            container
            justifyContent="center"
            alignItems="center"
            sx={{height: "100vh"}}
        >
            <Paper sx={{width: "100%", padding: 10}}>
                <Typography p>Student Center North, N203, Houston, TX 77204-3024 <CallIcon/>Phone: (713)
                    743-5065 <EmailIcon/> Email: isssohlp@central.uh.edu <PublicIcon/> <Link
                        href={"http://uh.edu/oisss"} underline={"always"}> http://uh.edu/oisss </Link> </Typography>
                <Typography align={"center"} variant="h4" gutterBottom>
                    Reduced Course Load (RCL) Form for Undergraduates
                </Typography>
                <Typography p>
                    F-1 students are required to maintain full-time enrollment while studying in the U.S. Undergraduate
                    and post-baccalaureate students are expected to complete a minimum of 12 hours of course work during
                    the fall and spring semesters. Classes during the summer are optional unless it is the first
                    semester at UH; then an F-1 student has to complete 6 hours (i.e. full-time for summer). ). The
                    following form must be completed before dropping below full-time hours after start of classes.
                </Typography>
                <Typography p><b>Note:</b> Dropping below full course load may involve the loss of resident tuition
                    based on a scholarship, grant, or on-campus employment.</Typography>
                <Typography p sx={{textDecoration: 'underline'}}>Please complete the form below by selecting one of the
                    options:</Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin={"normal"}>
                        <Typography variant={"h5"}> 1. ACADEMIC DIFFICULTY <u>(FIRST SEMESTER ONLY)</u></Typography>
                        <Box sx={{pl: 2}}>
                            <Typography p>RCL for valid academic difficulties is allowed once and only in the first
                                semester
                                when starting a new degree program. A minimum of 6hrs will still have to completed. This
                                option
                                cannot be used or submitted prior to ORD.</Typography>
                            <Typography variant={"h6"}>Initial Adjustment Issues (IAI)</Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="initialAdjustmentIssues"
                                        checked={formData.data.initialAdjustmentIssues}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="I am having initial difficulties with the English language, reading
                                    requirements, or unfamiliarity with American teaching methods."/>

                            <TextField
                                fullWidth
                                label="Please Explain:"
                                id="fullWidth"
                                name="iaiExplanation"
                                value={formData.data.iaiExplanation}
                                onChange={handleInputChange}
                            />
                            <Typography sx={{pt: 2}} variant={"h6"}>Improper Course Level Placement (ICLP)</Typography>
                            <FormControlLabel
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                }}
                                control={
                                    <Checkbox
                                        name="improperCoursePlacement"
                                        checked={formData.data.improperCoursePlacement}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="I am having difficulty with my class(es) due to improper course level placement
                                which may include not having the prerequisites or insufficient background to complete
                                the course at this time. For example, an international student taking U.S. History for
                                the first time (e.g. no previous exposure, insufficient background) or a philosophy
                                course that is based on a worldview that clashes with the student's own culture."/>
                            <Typography align={"center"} variant="h5" sx={{pt: 2}}>ICLP CERTIFYING
                                SIGNATURE BY PROFESSOR</Typography>
                            <Typography sx={{fontStyle: 'italic'}} p>I recommend that this student be allowed to drop
                                the following course(s) due to improper
                                course level placement as defined above.</Typography>
                            <Box
                                component="form"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    '& .MuiTextField-root': {
                                        m: 1,
                                        flexGrow: 1,
                                    },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    label="Class"
                                    variant="outlined"
                                    margin="normal"
                                    name="class1"
                                    value={formData.data.classes[0].class}
                                    onChange={(e) => handleClassChange(0, 'class', e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Professor"
                                    variant="outlined"
                                    margin="normal"
                                    name="professor1"
                                    value={formData.data.classes[0].professor}
                                    onChange={(e) => handleClassChange(0, 'professor', e.target.value)}
                                    fullWidth
                                />
                                <Button variant="text" onClick={() => handleOpenSignature("professor1")} fullWidth>
                                    Upload Signature
                                </Button>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="date1"
                                    type="date"
                                    value={formData.data.classes[0].date}
                                    onChange={(e) => handleClassChange(0, 'date', e.target.value)}
                                    fullWidth
                                />
                            </Box>
                            <Box
                                component="form"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    '& .MuiTextField-root': {
                                        m: 1,
                                        flexGrow: 1,
                                    },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    label="Class"
                                    variant="outlined"
                                    margin="normal"
                                    name="class2"
                                    value={formData.data.classes[1].class}
                                    onChange={(e) => handleClassChange(1, 'class', e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Professor"
                                    variant="outlined"
                                    margin="normal"
                                    name="professor2"
                                    value={formData.data.classes[1].professor}
                                    onChange={(e) => handleClassChange(1, 'professor', e.target.value)}
                                    fullWidth
                                />
                                <Button variant="text" onClick={() => handleOpenSignature("professor2")} fullWidth>
                                    Upload Signature
                                </Button>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="date2"
                                    type="date"
                                    value={formData.data.classes[1].date}
                                    onChange={(e) => handleClassChange(1, 'date', e.target.value)}
                                    fullWidth
                                />
                            </Box>
                            <Box
                                component="form"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    '& .MuiTextField-root': {
                                        m: 1,
                                        flexGrow: 1,
                                    },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    label="Class"
                                    variant="outlined"
                                    margin="normal"
                                    name="class2"
                                    value={formData.data.classes[2].class}
                                    onChange={(e) => handleClassChange(2, 'class', e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Professor"
                                    variant="outlined"
                                    margin="normal"
                                    name="professor2"
                                    value={formData.data.classes[2].professor}
                                    onChange={(e) => handleClassChange(2, 'professor', e.target.value)}
                                    fullWidth
                                />
                                <Button variant="text" onClick={() => handleOpenSignature("professor3")} fullWidth>
                                    Upload Signature
                                </Button>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="date2"
                                    type="date"
                                    value={formData.data.classes[2].date}
                                    onChange={(e) => handleClassChange(2, 'date', e.target.value)}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                        <Typography sx={{pt: 2}} variant={"h5"}>2. MEDICAL REASON</Typography>
                        <Box sx={{pl: 2}}>
                            <FormControlLabel
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                }}
                                control={
                                    <Checkbox
                                        name="medicalReason"
                                        checked={formData.data.medicalReason}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Valid medical reason must be proven with a supporting letter from a licensed
                                medical doctor, clinical psychologist, or doctor of osteopathy. The letter has to
                                contain the following information: written in English on a letterhead, signed in ink,
                                the recommended credit hours of enrollment, when the below hours should begin and end
                                (if known), details of when student first saw the doctor, and when they advised the
                                student to withdraw from course(s). Medical excuses must be renewed each semester. You
                                are only allowed to accumulate 12 months of reduced course load for medical reasons
                                during any given degree level. Zero hours are allowed under this provision of the law
                                only if it is clearly recommended by the licensed medical professional."/>
                            <FormControlLabel
                                sx={{pl: 2}}
                                control={
                                    <Checkbox
                                        name="medicalLetterAttached"
                                        checked={formData.data.medicalLetterAttached}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Letter from a licensed medical doctor, doctor of osteopathy, a licensed
                                psychologist/clinical psychologist is attached"/>
                        </Box>
                        <Typography sx={{pt: 2}} variant={"h5"}>3. FINAL SEMESTER</Typography>
                        <Box sx={{pl: 2}}>
                            <FormControlLabel
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                }}
                                control={
                                    <Checkbox
                                        name="finalSemester"
                                        checked={formData.data.finalSemester}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label={
                                    <> This is my final semester and I only need
                                        <TextField
                                            name="finalSemesterHours"
                                            type="number"
                                            label="hours"
                                            variant="outlined"
                                            size="small"
                                            value={formData.data.finalSemesterHours}
                                            onChange={handleInputChange}
                                            sx={{width: '150px', marginLeft: 1}}
                                        />hours of course work to complete
                                        my degree. I understand that if I am granted a reduced course load and fail to
                                        complete
                                        my degree as planned, I may be in violation of my legal status and will need to
                                        apply
                                        for reinstatement. (If you need only one course to finish your program of study,
                                        it
                                        cannot be taken through online/distance education).</>}/>
                        </Box>
                        <Typography sx={{pt: 2}} variant={"h5"}>4. CONCURRENTLY ENROLLED</Typography>
                        <Box sx={{pl: 2}}>
                            <FormControlLabel
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                }}
                                control={
                                    <Checkbox
                                        name="concurrentlyEnrolled"
                                        checked={formData.data.concurrentlyEnrolled}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label={
                                    <>
                                        I am taking courses at another college/University and want to drop a course at
                                        UH.
                                        I will still have 12 hours of enrollment between both schools. After the drop, I
                                        will have
                                        <TextField
                                            name="hoursUH"
                                            type="number"
                                            label="hours at UH"
                                            variant="outlined"
                                            size="small"
                                            value={formData.data.hoursUH}
                                            onChange={handleInputChange}
                                            sx={{width: '150px', marginLeft: 1}}
                                        />
                                        hours at UH and
                                        <TextField
                                            name="hoursOtherSchool"
                                            type="number"
                                            label="hours at"
                                            variant="outlined"
                                            size="small"
                                            value={formData.data.hoursOtherSchool}
                                            onChange={handleInputChange}
                                            sx={{width: '150px', marginLeft: 1}}
                                        />
                                        hours at
                                        <TextField
                                            name="schoolName"
                                            label="school name"
                                            variant="outlined"
                                            size="small"
                                            value={formData.data.schoolName}
                                            onChange={handleInputChange}
                                            sx={{width: '200px', marginLeft: 1}}
                                        />
                                        . Attach proof of concurrent enrollment. Academic advisor signature is not
                                        required for this option,
                                        only ISSSO counselor.
                                    </>
                                }/>
                        </Box>
                        <Box sx={{border: 1, mt: 2}}>
                            <Typography p sx={{lineHeight: 1.5}}>
                                I am applying for a reduced course load for the
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="fallSemester"
                                            checked={formData.data.fallSemester}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="fall semester of 20"/>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="fallYear"
                                    type="number"
                                    value={formData.data.fallYear}
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />{' '}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="springSemester"
                                            checked={formData.data.springSemester}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="spring semester of 20"/>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="springYear"
                                    type="number"
                                    value={formData.data.springYear}
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />{' '}
                                I want to drop the following class(es):
                                <TextField
                                    label={"Course Number"}
                                    variant="outlined"
                                    margin="normal"
                                    name="courseOne"
                                    value={formData.data.courseOne}
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />{' '},
                                <TextField
                                    label={"Course Number"}
                                    variant="outlined"
                                    margin="normal"
                                    name="courseTwo"
                                    value={formData.data.courseTwo}
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />{' '}
                                <TextField
                                    label={"Course Number"}
                                    variant="outlined"
                                    margin="normal"
                                    name="courseThree"
                                    value={formData.data.courseThree}
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />.
                                After the drop, I will have a total of
                                <TextField
                                    label={"Hours"}
                                    variant="outlined"
                                    margin="normal"
                                    name="remainingHours"
                                    type="number"
                                    value={formData.data.remainingHours}
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />
                                hours (at UH) for the:
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="remainingFallYearChecked"
                                            checked={formData.data.remainingFallYearChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="Fall semester of 20"/>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="remainingFallYear"
                                    type="number"
                                    value={formData.data.remainingFallYear}
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />.
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="remainingSpringYearChecked"
                                            checked={formData.data.remainingSpringYearChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="Spring semester of 20"/>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="remainingSpringYear"
                                    type="number"
                                    value={formData.data.remainingSpringYear}
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />.
                            </Typography>
                            <Typography p>
                                You must submit a copy of this form to Office of the University Registrar (located in
                                the Welcome Center) if you are requesting the drop after the 1st day of the semester.
                                The approval signature from your Academic Advisor and ISSSO are required to drop a
                                course. You may still be responsible for the tuition and fee charges to the dropped
                                course(s) after passing the deadline.
                                <Box
                                    component="form"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        '& .MuiTextField-root': {
                                            m: 1,
                                            flexGrow: 1,
                                        },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        label="Your Name"
                                        variant="outlined"
                                        margin="normal"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <Button variant="text" onClick={() => handleOpenSignature("student")} fullWidth>
                                        Upload Signature
                                    </Button>
                                    <TextField
                                        label="PSID"
                                        variant="outlined"
                                        margin="normal"
                                        name="peopleSoftId"
                                        type="number"
                                        value={formData.peopleSoftId}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        name="signed_on"
                                        type="date"
                                        value={formData.data.studentSignatureDate || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                data: {
                                                    ...prev.data,
                                                    studentSignatureDate: e.target.value,
                                                },
                                            }))
                                        }
                                        fullWidth
                                    />
                                </Box>
                            </Typography>
                        </Box>
                        <Box sx={{mt: 2}}>
                            <Typography align={"center"} variant="h5" gutterBottom>
                                APPROVAL SIGNATURE FROM ACADEMIC ADVISOR
                            </Typography>
                            <Box
                                component="form"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    '& .MuiTextField-root': {
                                        m: 1,
                                        flexGrow: 1,
                                    },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    margin="normal"
                                    name="advisorName"
                                    value={formData.data.advisorName}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <Button variant="text" onClick={() => handleOpenSignature("advisor")} fullWidth>
                                    Upload Signature
                                </Button>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="advisorSignatureDate"
                                    type="date"
                                    value={formData.data.advisorSignatureDate}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Box>
                            <Typography align={"center"} variant="h5" gutterBottom>
                                APPROVAL SIGNATURE FROM ISSSO (if course drop is required)
                            </Typography>
                            <Box
                                component="form"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    '& .MuiTextField-root': {
                                        m: 1,
                                        flexGrow: 1,
                                    },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    margin="normal"
                                    name="issoName"
                                    value={formData.data.issoName}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <Button variant="text" onClick={() => handleOpenSignature("isso")} fullWidth>
                                    Upload Signature
                                </Button>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="issoSignatureDate"
                                    type="date"
                                    value={formData.data.issoSignatureDate}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                        <Stack spacing={2} mt={2} direction={"row"} sx={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                        >
                            <Button
                                variant="contained"
                                type="button"
                                color="success"
                                onClick={handleSave}
                                sx={{marginTop: 2, display: 'inline-block !important'}}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{marginTop: 2, display: 'inline-block !important'}}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </FormControl>
                </form>
            </Paper>

            {/* Signature Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogTitle>
                    {activeSignatureId === "student" ? "Student Signature" :
                        activeSignatureId === "advisor" ? "Advisor Signature" :
                            activeSignatureId === "isso" ? "ISSO Signature" :
                                activeSignatureId?.startsWith("professor") ? "Professor Signature" : "Signature"}
                </DialogTitle>
                <DialogContent>
                    <Signature id={activeSignatureId} onSave={handleSignatureSave}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid2>
    );
};

export default ReduceCourseLoadForm;