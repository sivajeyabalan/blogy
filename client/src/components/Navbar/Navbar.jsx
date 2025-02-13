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

    const handleImageError = (e) => {
        // Set a default image if the profile image fails to load
        e.target.src = "https://www.w3schools.com/w3images/avatar2.png";  // Default fallback image
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
                        <Avatar
                            className={classes.purple}
                            alt={user?.result.name}
                            src={user?.result.imageUrl || ""}
                            onError={handleImageError}  // Add error handler to fallback to default image
                            style={{ backgroundColor: user?.result.imageUrl ? undefined : "#3357FF" }}
                        >
                            {user?.result.name.charAt(0)}
                        </Avatar>
                        {isLargeScreen && (
                            <Typography className={classes.userName} variant="h6">
                                {user?.result.name}
                            </Typography>
                        )}
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
