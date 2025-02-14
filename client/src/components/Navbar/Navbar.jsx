import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Avatar, Button } from "@mui/material";
import useStyles from "./styles";
import memoriesLogo from "../../images/memories-Logo.png";
import memoriesText from "../../images/memories-Text.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const isLargeScreen = useMediaQuery("(min-width:600px)");

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem("profile");
        setUser(null);
        navigate("/");
        window.location.reload();
    };

    useEffect(() => {
        const token = user?.token;
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }
        setUser(JSON.parse(localStorage.getItem("profile")));
    }, [location]);

    const getAvatarContent = (user) => {
        if (!user?.result) return null;

        if (user.result.googleId && user.result.imageUrl) {
            return (
                <Avatar
                    className={classes.purple}
                    alt={user.result.name}
                    src={user.result.imageUrl}
                    onError={(e) => {
                        e.target.src = null; // Clear failed image
                        e.target.style.backgroundColor = "#3357FF";
                        e.target.innerHTML = user.result.name.charAt(0);
                    }}
                />
            );
        }

        // For regular users or if Google image fails
        return (
            <Avatar
                className={classes.purple}
                alt={user.result.name}
                style={{ backgroundColor: "#3357FF" }}
            >
                {user.result.name.charAt(0)}
            </Avatar>
        );
    };

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>
                <Link to="/" className={classes.brandContainer}>
                    <img src={memoriesText} alt="icon" height="45px" />
                    <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
                </Link>
            </div>

            <Toolbar className={classes.toolbar}>
                {user?.result ? (
                    <div className={classes.profile}>
                        {getAvatarContent(user)}
                        {isLargeScreen && (
                            <Typography className={classes.userName} variant="h6">
                                {user.result.name}
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            className={classes.logout}
                            color="secondary"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button
                        component={Link}
                        to="/auth"
                        variant="contained"
                        color="primary"
                    >
                        Sign In
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;