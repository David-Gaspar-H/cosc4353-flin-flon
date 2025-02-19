import React, {useState} from 'react';
import {FormControl, TextField, InputLabel, Select, MenuItem, Button, Paper} from '@mui/material';

const UserForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        role: '',
        status: 0, // Active by default
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
                <FormControl fullWidth margin={"normal"}>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        value={formData.role}
                        label="Role"
                        onChange={(e) => setFormData({...formData, role: e.target.role})}
                    >
                        <MenuItem value={0}>Admin</MenuItem>
                        <MenuItem value={1}>User</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin={"normal"}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        value={formData.status}
                        label="Status"
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                        <MenuItem value={0}>Active</MenuItem>
                        <MenuItem value={1}>Inactive</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleSubmit} sx={{ marginTop: 2, width: 'auto' }}>
                    Submit
                </Button>
            </FormControl>
        </Paper>
    );
};

export default UserForm;
