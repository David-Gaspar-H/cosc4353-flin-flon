import React, {useState} from 'react';
import {FormControl, TextField, InputLabel, Select, MenuItem, Button, Paper, Typography} from '@mui/material';

const UserForm = ({userID, setSelectedUserId}) => {
    const [user, setUserData] = useState({
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
        setUserData({
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
                {userID ? 'Edit User' : 'User Form'}
            </Typography>
            <FormControl fullWidth margin={"normal"}>
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="username"
                    value={user.username}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleInputChange}
                />
                <FormControl fullWidth margin={"normal"}>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        value={user.role}
                        label="Role"
                        onChange={(e) => setUserData({...user, role: e.target.role})}
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
                        value={user.status}
                        label="Status"
                        onChange={(e) => setUserData({...user, status: e.target.value})}
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
