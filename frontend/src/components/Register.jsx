import React, {useState} from 'react';
import {FormControl, TextField, InputLabel, Select, MenuItem, Button, Paper, Typography} from '@mui/material';

const Register = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        // Handle form submission logic
        console.log(user);
    };

    return (
        <Paper sx={{width: '500px', padding: 3}}>
            <Typography variant="h4" gutterBottom>
                Register User
            </Typography>
            <FormControl fullWidth margin={"normal"}>
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="firstName"
                    value={setUser.firstName}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="lastName"
                    value={setUser.lastName}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="email"
                    value={setUser.email}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="username"
                    value={setUser.username}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="password"
                    type="password"
                    value={setUser.password}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Re-enter Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="password"
                    type="password"
                    value={setUser.password}
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
