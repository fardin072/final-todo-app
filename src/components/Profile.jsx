
import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const dashboardClick = () =>{
        navigate("/dashboard");
    }
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        profile_picture: "",
    });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);  // Track loading state
    const [error, setError] = useState(null); // Track errors
    const navigate = useNavigate();

    useEffect(() => {
        // Get the username from localStorage
        const storedUsername = localStorage.getItem("username");

        if (storedUsername) {
            // Dynamically build the API URL
            const apiUrl = `https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/profile/${storedUsername}`;

            // Fetch user data from the API based on the username
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    console.log("API Response:", data);  // Debug API response
                    if (data) {
                        setUser(data);  // Set the user profile data if found
                    } else {
                        setError("User profile not found!");  // Handle case when user not found
                        navigate("/login");  // Redirect to login if no user found
                    }
                    setLoading(false);  // Set loading to false once data is fetched
                })
                .catch((error) => {
                    console.error("Error fetching profile:", error);
                    setError("Error fetching profile.");  // Set error state
                    setLoading(false);
                });
        } else {
            setError("Username not found in localStorage.");
            navigate("/login"); // Redirect to login if no username is found
        }
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSave = () => {
        // Update the user profile in the API
        const apiUrl = `https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/profile/${user.username}`;

        fetch(apiUrl, {
            method: "PUT",  // Use PUT method for updating data
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),  // Send the updated user data in the request body
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    // If the update was successful, update the localStorage
                    localStorage.setItem("user", JSON.stringify(user));
                    setEditMode(false);  // Exit edit mode
                } else {
                    // Handle errors if the update fails
                    setError("Error updating profile.");
                }
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                setError("Error updating profile.");
            });
    };


    if (loading) {
        return <Typography>Loading...</Typography>;  // Display loading text while fetching
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;  // Display error message
    }

    return (
        <Container maxWidth="sm">
            
            <Box mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white">
            <div className="flex flex-col gap-3 mb-4">
                <Button variant="contained" color="secondary"  onClick={dashboardClick}>Dashboard</Button>
            </div>
                <Typography variant="h5" textAlign={"center"} gutterBottom>
                    User Profile
                </Typography>

                {/* Profile Picture Section */}
                <Box textAlign="center" mb={2}>
                    <Avatar
                        alt={user.name}
                        src={user.profile_picture || "/default-profile.png"}  // Default image if no profile picture is available
                        sx={{ width: 100, height: 100, margin: "0 auto" }}
                    />
                </Box>

                <form>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Full Name"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        name="username"
                        value={user.username}
                        disabled
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Phone Number"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Profile Picture"
                        name="profile_picture"
                        value={user.profile_picture}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setEditMode(!editMode)}
                        >
                            {editMode ? "Cancel" : "Edit"}
                        </Button>
                        {editMode && (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSave}
                            >
                                Save Changes
                            </Button>
                        )}
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default Profile;
