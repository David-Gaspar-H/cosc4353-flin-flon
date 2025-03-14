import React, {useState} from "react";
import {
    FormControl,
    TextField,
    Button,
    Paper,
    Typography,
    Grid2, Link, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import api from "../services/api";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Signature from "./Signature.jsx";


const ReduceCourseLoadForm = () => {
    const [open, setOpen] = useState(false);
    // Function to open the dialog
    const handleOpen = () => {
        setOpen(true);
    };

    // Function to close the dialog
    const handleClose = () => {
        setOpen(false);
    };
    const handleInputChange = () => {

    };

    const handleSubmit = async () => {

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
                        <Box sx={{pl: 2}} gutterBottom>
                            <Typography p>RCL for valid academic difficulties is allowed once and only in the first
                                semester
                                when starting a new degree program. A minimum of 6hrs will still have to completed. This
                                option
                                cannot be used or submitted prior to ORD.</Typography>
                            <Typography variant={"h6"}>Initial Adjustment Issues (IAI)</Typography>
                            <FormControlLabel
                                control={<Checkbox/>}
                                label="I am having initial difficulties with the English language, reading
                                    requirements, or unfamiliarity with American teaching methods."/>

                            <TextField fullWidth label="Please Explain:" id="fullWidth"/>
                            <Typography sx={{pt: 2}} variant={"h6"}>Improper Course Level Placement (ICLP)</Typography>
                            <FormControlLabel
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                }}
                                control={<Checkbox/>}
                                label="I am having difficulty with my class(es) due to improper course level placement
                                which may include not having the prerequisites or insufficient background to complete
                                the course at this time. For example, an international student taking U.S. History for
                                the first time (e.g. no previous exposure, insufficient background) or a philosophy
                                course that is based on a worldview that clashes with the student’s own culture."/>
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
                                    name="class"
                                    // value={}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Professor"
                                    variant="outlined"
                                    margin="normal"
                                    name="professor"
                                    // value={}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <Button variant="text" onClick={handleOpen} fullWidth>
                                    Upload Signature
                                </Button>
                                {/* Signature Component */}
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Signature</DialogTitle>
                                    <DialogContent>
                                        <Signature></Signature>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <TextField
                                    // label="Date"
                                    variant="outlined"
                                    margin="normal"
                                    name="date"
                                    type="date"
                                    // value={}
                                    onChange={handleInputChange}
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
                                    name="class"
                                    // value={}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Professor"
                                    variant="outlined"
                                    margin="normal"
                                    name="professor"
                                    // value={}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <Button variant="text" onClick={handleOpen} fullWidth>
                                    Upload Signature
                                </Button>
                                {/* Signature Component */}
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Signature</DialogTitle>
                                    <DialogContent>
                                        <Signature></Signature>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <TextField
                                    // label="Date"
                                    variant="outlined"
                                    margin="normal"
                                    name="date"
                                    type="date"
                                    // value={}
                                    onChange={handleInputChange}
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
                                control={<Checkbox/>}
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
                                control={<Checkbox/>}
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
                                control={<Checkbox/>}
                                label={
                                    <> This is my final semester and I only need
                                        <TextField
                                            // value={}
                                            name="hours"
                                            type="number"
                                            label="hours"
                                            variant="outlined"
                                            size="small"
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
                                control={<Checkbox/>}
                                label={
                                    <>
                                        I am taking courses at another college/University and want to drop a course at
                                        UH.
                                        I will still have 12 hours of enrollment between both schools. After the drop, I
                                        will have
                                        <TextField
                                            // value={}
                                            name="hoursUH"
                                            type="number"
                                            label="hours at UH"
                                            variant="outlined"
                                            size="small"
                                            onChange={handleInputChange}
                                            sx={{width: '150px', marginLeft: 1}}
                                        />
                                        hours at UH and
                                        <TextField
                                            // value={}
                                            name="hoursOtherSchool"
                                            type="number"
                                            label="hours at"
                                            variant="outlined"
                                            size="small"
                                            onChange={handleInputChange}
                                            sx={{width: '150px', marginLeft: 1}}
                                        />
                                        hours at
                                        <TextField
                                            // value={}
                                            name="schoolName"
                                            label="school name"
                                            variant="outlined"
                                            size="small"
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
                                I am applying for a reduced course load for the fall semester of 20
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="fallYear"
                                    type="number"
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />{' '}
                                spring semester of 20
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="springYear"
                                    type="number"
                                    // value={}
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
                                    name="CourseOne"
                                    // value={}
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
                                    name="CourseTwo"
                                    // value={}
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
                                    name="CourseThree"
                                    // value={}
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
                                    name="hours"
                                    type="number"
                                    // value={}
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />
                                hours (at UH) for the: Fall semester 20
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="fallYear"
                                    type="number"
                                    // value={}
                                    onChange={handleInputChange}
                                    sx={{
                                        display: 'inline-block',
                                        margin: '0',
                                        '& input': {fontSize: '1rem', padding: '0.5rem'},
                                    }}
                                />. Spring semester of 20<TextField
                                variant="outlined"
                                margin="normal"
                                name="fallYear"
                                type="number"
                                // value={}
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
                                        // value={}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <Button variant="text" onClick={handleOpen} fullWidth>
                                    Upload Signature
                                </Button>
                                {/* Signature Component */}
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Signature</DialogTitle>
                                    <DialogContent>
                                        <Signature></Signature>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                    <TextField
                                        label="PSID"
                                        variant="outlined"
                                        margin="normal"
                                        name="psid"
                                        type="number"
                                        // value={}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <TextField
                                        // label="Date"
                                        variant="outlined"
                                        margin="normal"
                                        name="date"
                                        type="date"
                                        // value={}
                                        onChange={handleInputChange}
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
                                    label="name"
                                    variant="outlined"
                                    margin="normal"
                                    name="name"
                                    // value={}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <Button variant="text" onClick={handleOpen} fullWidth>
                                    Upload Signature
                                </Button>
                                {/* Signature Component */}
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Signature</DialogTitle>
                                    <DialogContent>
                                        <Signature></Signature>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <TextField
                                    // label="Date"
                                    variant="outlined"
                                    margin="normal"
                                    name="date"
                                    type="date"
                                    // value={}
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
                                    name="name"
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <Button variant="text" onClick={handleOpen} fullWidth>
                                    Upload Signature
                                </Button>
                                {/* Signature Component */}
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Signature</DialogTitle>
                                    <DialogContent>
                                        <Signature></Signature>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <TextField
                                    // label="Date"
                                    variant="outlined"
                                    margin="normal"
                                    name="date"
                                    type="date"
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{marginTop: 2}}
                        >
                            Submit
                        </Button>
                    </FormControl>
                </form>
            </Paper>
        </Grid2>
    );
};

export default ReduceCourseLoadForm;
