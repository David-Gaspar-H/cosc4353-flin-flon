import "./App.css";
import ResponsiveAppBar from "./components/ResponsiveAppBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {UserProvider, useUser} from "./components/context/UserContext.jsx";
import Login from "./components/Login";
import UserManagement from "./components/UserManagement.jsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Register from "./components/Register.jsx";
import HomePage from "./components/HomePage.jsx";
import AuthCallback from "./components/AuthCallback";
import UserForms from "./components/UserForms.jsx";
import UserFormRequest from "./components/UserFormRequest.jsx";
import AdminFormApproval from "./components/AdminFormApproval.jsx";
import FormsTable from "./components/FormsTable.jsx";
import Footer from "./components/Footer.jsx";
import {Box} from "@mui/material";
import React from "react";

function AppContent() {
    const {user, logout} = useUser();
    return (
        <>
            <ResponsiveAppBar user={user} logout={logout}/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/my-forms" element={<UserForms/>}/>
                <Route path="/form-request" element={<UserFormRequest/>}/>
                <Route path="/auth/callback" element={<AuthCallback/>}/>
                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <UserManagement/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/form-approval"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminFormApproval/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin-form"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <FormsTable/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
            {/* Footer with clear separation */}
            <Box
                sx={{
                    mt: "auto",
                    pt: 3,
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                <Footer/>
            </Box>
        </>
    );
}

function App() {
    return (
        <UserProvider>
            <Router>
                <AppContent/>
            </Router>
        </UserProvider>
    );
}

export default App;
