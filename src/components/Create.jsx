import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { Login } from "@mui/icons-material";

const Register = () => {
    const navigate = useNavigate();
    const signInHandle = () => {
        navigate("/login");
    }

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        cpassword: "",
        profile_picture: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        // Regular expression for basic email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        // Password should be at least 8 characters long and contain at least one special character
        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validatePhone = (phone) => {
        // Phone number must be 10 digits
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const validateForm = () => {
        if (!validateEmail(formData.email)) {
            Swal.fire("Error!", "Please enter a valid email address.", "error");
            return false;
        }

        if (!validatePassword(formData.password)) {
            Swal.fire("Error!", "Password must be at least 8 characters long and include at least one special character.", "error");
            return false;
        }

        if (formData.password !== formData.cpassword) {
            Swal.fire("Error!", "Passwords do not match.", "error");
            return false;
        }

        if (!validatePhone(formData.phone)) {
            Swal.fire("Error!", "Phone number must be exactly 10 digits.", "error");
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Create a copy of formData without cpassword
        const { cpassword, ...dataToSend } = formData;
        console.log(dataToSend);

        try {
            const response = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Success!", result.message, "success");
                // Save the complete user data to localStorage after successful registration
                localStorage.setItem("user", JSON.stringify(result.user));
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    username: "",
                    password: "",
                    profile_picture: "",
                });
                navigate("/login"); // Redirect to login page after successful registration
            } else {
                Swal.fire("Error!", result.detail || "Something went wrong.", "error");
            }
        } catch (error) {
            Swal.fire("Network Error!", "Failed to connect to the server.", "error");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: "background.paper" }}>
                <Typography variant="h5" align="center" gutterBottom>Register</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Confirm Password"
                        name="cpassword"
                        type="password"
                        value={formData.cpassword}
                        onChange={handleChange}
                        required
                    />
                    <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 3 }}>
                        Register
                    </Button>
                    <Typography align="center" sx={{ mt: 2 }}>
                        Do have an account? <br /> <br />
                        <div className="flex flex-col gap-3 mb-4">
                            <Button variant="contained" color="secondary" onClick={signInHandle}> <Login></Login>    Sign In</Button>
                        </div>
                    </Typography>
                </form>
            </Box>
        </Container>
    );
};

export default Register;
