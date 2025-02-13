
import React, { useState, useEffect } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, Box, Alert } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { signin, signup } from '../../actions/auth';
import { useStyles } from './Styles';
import Input from './Input';

const theme = createTheme();
const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [savedState, setSavedState] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isSignup) {
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords don't match");
                    return;
                }
                await dispatch(signup(formData, navigate))
                    .catch((err) => {
                        if (err?.response?.data?.message === 'User already exists') {
                            setError('An account with this email already exists. Please sign in.');
                            setSavedState({ email: formData.email, password: formData.password });
                            setTimeout(() => setIsSignup(false), 1000);
                        } else {
                            setError(err?.response?.data?.message || 'Signup failed. Please try again.');
                        }
                    });
            } else {
                await dispatch(signin(formData, navigate))
                    .catch((err) => {
                        if (err?.response?.data?.message === "User doesn't exist") {
                            setError('Account not found. Please sign up first.');
                            setSavedState({ email: formData.email, password: formData.password });
                            setTimeout(() => setIsSignup(true), 1000);
                        } else if (err?.response?.data?.message === 'Invalid credentials') {
                            setError('Invalid email or password.');
                        } else {
                            setError(err?.response?.data?.message || 'Sign in failed. Please try again.');
                        }
                    });
            }
        } catch (error) {
            console.error('Auth Error:', error);
            setError('Authentication failed. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleShowPassword = () => setShowPassword((prev) => !prev);
    const handleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    const switchMode = () => {
        if (savedState) {
            const newFormData = {
                ...initialState,
                email: savedState.email,
                password: savedState.password
            };
            setFormData(newFormData);
        } else {
            setFormData(initialState);
        }
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setError('');
    };

    const googleSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const decoded = jwtDecode(token);

            const userData = {
                result: {
                    email: decoded.email,
                    name: decoded.name,
                    googleId: decoded.sub,
                    imageUrl: decoded.picture,
                },
                token,
            };

            dispatch({ type: "AUTH", data: userData });
            localStorage.setItem("profile", JSON.stringify(userData));
            navigate("/");
        } catch (error) {
            console.error("Google Sign In Error:", error);
            setError('Google sign in failed. Please try again.');
        }
    };

    const googleFailure = () => {
        setError('Google Sign In was unsuccessful. Please try again.');
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
                            {isSignup ? 'Sign Up' : 'Sign In'}
                        </Typography>
                        {error && (
                            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                                {error}
                            </Alert>
                        )}
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
                                    autoFocus={!isSignup}
                                />
                                <Input
                                    name="password"
                                    label="Password"
                                    handleChange={handleChange}
                                    type={showPassword ? 'text' : 'password'}
                                    handleShowPassword={handleShowPassword}
                                    value={formData.password}
                                />
                                {isSignup && (
                                    <Input
                                        name="confirmPassword"
                                        label="Repeat Password"
                                        handleChange={handleChange}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        handleShowPassword={handleShowConfirmPassword}
                                        value={formData.confirmPassword}
                                    />
                                )}
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className={classes.submit}
                                sx={{ mt: 2 }}
                            >
                                {isSignup ? 'Sign Up' : 'Sign In'}
                            </Button>

                            <Box className={classes.googleButtonWrapper} sx={{ mt: 2 }}>
                                <GoogleLogin
                                    onSuccess={googleSuccess}
                                    onError={googleFailure}
                                    theme="filled_blue"
                                    shape="pill"
                                    useOneTap
                                    redirectUri="https://memories-project-client-mar8y1yk4-nitheeshlingam-rs-projects.vercel.app"
                                />
                            </Box>

                            <Button
                                onClick={switchMode}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </GoogleOAuthProvider>
        </ThemeProvider>
    );
};

export default Auth;