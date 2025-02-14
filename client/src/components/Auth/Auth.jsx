import React, { useState } from "react";
import { Avatar, Button, Paper, Grid, Typography, Container, Box } from "@mui/material";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { signin, signup, googleSignIn } from "../../actions/auth";
import { useStyles } from "./Styles";
import Input from "./Input";

const theme = createTheme();
const initialState = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

const Auth = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const switchMode = () => {
        setFormData(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            dispatch(signup(formData, navigate));
        } else {
            dispatch(signin(formData, navigate));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => setShowPassword((prev) => !prev);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const decoded = jwtDecode(token);
            console.log("Google decoded data:", decoded);

            // Create user data from Google response
            const googleUser = {
                email: decoded.email,
                name: decoded.name,
                googleId: decoded.sub,
                imageUrl: decoded.picture  // Changed from 'picture' to 'imageUrl' to match schema
            };

            dispatch(googleSignIn(googleUser, navigate));
        } catch (error) {
            console.log("Google Sign In Error:", error);
            alert("Google Sign In failed. Please try again.");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <GoogleOAuthProvider clientId="748632032018-jajhqq9kvlmegvn34dj0kvad2go0lq5f.apps.googleusercontent.com">
                <Container component="main" maxWidth="xs">
                    <Paper className={classes.paper} elevation={3}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {isSignup ? "Sign Up" : "Sign In"}
                        </Typography>
                        <form className={classes.form} onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {isSignup && (
                                    <>
                                        <Input
                                            name="firstName"
                                            label="First Name"
                                            handleChange={handleChange}
                                            autoFocus
                                            half
                                            value={formData.firstName}
                                        />
                                        <Input
                                            name="lastName"
                                            label="Last Name"
                                            handleChange={handleChange}
                                            half
                                            value={formData.lastName}
                                        />
                                    </>
                                )}
                                <Input
                                    name="email"
                                    label="Email Address"
                                    handleChange={handleChange}
                                    type="email"
                                    value={formData.email}
                                />
                                <Input
                                    name="password"
                                    label="Password"
                                    handleChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    handleShowPassword={handleShowPassword}
                                    value={formData.password}
                                />
                                {isSignup && (
                                    <Input
                                        name="confirmPassword"
                                        label="Repeat Password"
                                        handleChange={handleChange}
                                        type="password"
                                        value={formData.confirmPassword}
                                    />
                                )}
                            </Grid>

                            <Button type="submit" fullWidth variant="contained" className={classes.submit} sx={{ mt: 2 }}>
                                {isSignup ? "Sign Up" : "Sign In"}
                            </Button>

                            <Box className={classes.googleButtonWrapper} sx={{ mt: 2 }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => alert("Google Sign In was unsuccessful. Try again later.")}
                                    theme="filled_blue"
                                    shape="pill"
                                    style={{ color: "white", padding: "10px", borderRadius: "5px" }}
                                    useOneTap
                                />
                            </Box>

                            <Button onClick={switchMode} fullWidth sx={{ mt: 2 }}>
                                {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </GoogleOAuthProvider>
        </ThemeProvider>
    );
};

export default Auth;