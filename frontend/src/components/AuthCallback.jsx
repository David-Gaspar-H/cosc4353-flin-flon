import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    CircularProgress, 
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography
} from "@mui/material";
import api from "../services/api";

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [authCode, setAuthCode] = useState(null);
    const [selectedRole, setSelectedRole] = useState('basicuser');

    useEffect(() => {
        const code = new URLSearchParams(location.search).get("code");
        if (code) {
            setAuthCode(code);
            handleMicrosoftAuth(code);
        } else {
            navigate("/login");
        }
    }, [location, navigate]);

    const handleMicrosoftAuth = async (code) => {
        try {
            const response = await api.post("/ms-auth/callback/", { code });
            
            // If user exists and is active, proceed with login
            if (response.data.user && response.data.user.status === 'active') {
                handleSuccessfulLogin(response.data.user);
            }
            // If user is pending (new user), show role selection
            else if (response.data.user && response.data.user.status === 'pending') {
                setShowRoleDialog(true);
            }
            // Handle other cases (e.g., deactivated users)
            else {
                throw new Error(response.data.error || 'Authentication failed');
            }
        } catch (error) {
            console.error("Microsoft auth failed:", error);
            navigate("/login", { 
                state: { 
                    error: "Authentication failed. Please try again or contact support." 
                }
            });
        }
    };

    const handleRoleSubmit = async () => {
        try {
            const response = await api.post("/ms-auth/callback/", {
                code: authCode,
                role: selectedRole
            });

            if (response.data.user) {
                handleSuccessfulLogin(response.data.user);
            } else {
                throw new Error('Failed to update role');
            }
        } catch (error) {
            console.error("Role update failed:", error);
            navigate("/login");
        }
    };

    const handleSuccessfulLogin = (user) => {
        if (user.role === "admin") {
            navigate("/dashboard");
        } else {
            navigate("/");
        }
    };

    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>

            <Dialog open={showRoleDialog} onClose={() => navigate("/login")}>
                <DialogTitle>Select Your Role</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Please select your role to complete the registration:
                    </Typography>
                    <RadioGroup
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <FormControlLabel 
                            value="basicuser" 
                            control={<Radio />} 
                            label="Basic User"
                        />
                        <FormControlLabel 
                            value="admin" 
                            control={<Radio />} 
                            label="Admin"
                        />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate("/login")}>Cancel</Button>
                    <Button onClick={handleRoleSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AuthCallback;