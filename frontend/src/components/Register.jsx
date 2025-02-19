import React, {useState} from 'react';
import {FormControl, TextField, InputLabel, Select, MenuItem, Button, Paper} from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        // Handle form submission logic
        console.log(formData);
    };

    return (
        <Paper sx={{width: '500px', padding: 3}}>
            <FormControl fullWidth margin={"normal"}>
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Re-enter Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <Button variant="contained" onClick={handleSubmit} sx={{ marginTop: 2, width: 'auto' }}>
                    Submit
                </Button>
            </FormControl>
        </Paper>
    );
};

export default Register;
