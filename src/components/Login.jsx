import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from '@mui/material';
import { AppRegistrationOutlined } from '@mui/icons-material';

function Login() {
    const navigate = useNavigate();
    const signUpHandle = () => {
        navigate("/register");
    }
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");

    async function loginClick() {
        const body = {
            "username": username,
            "password": pass
        }
        const r = await fetch("http://3.109.211.104:8001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const j = await r.json();
        if (j["access_token"]) {
            localStorage.setItem("username", username);
            toast.success("Logged in");
            navigate("/dashboard");
        }
        else {
            toast.error(j["detail"]);
        }
    }

    return <>
        <Container maxWidth="sm" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: "background.paper", width: "100%" }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={(e) => { e.preventDefault(); loginClick(); }}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        required
                    />
                    <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 3 }}>
                        Login
                    </Button>
                </form>
                <Typography align="center" sx={{ mt: 2 }}>
                    Do not have an account? <br /> <br />
                    <div className="flex flex-col gap-3 mb-4">
                        <Button variant="contained" color="secondary" onClick={signUpHandle}> <AppRegistrationOutlined></AppRegistrationOutlined>    Sign Up</Button>
                    </div>
                </Typography>
            </Box>
        </Container>
    </>
}

export { Login }