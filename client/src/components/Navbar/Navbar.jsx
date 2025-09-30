import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import useStyles from "./styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const isLargeScreen = useMediaQuery("(min-width:600px)");

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("profile");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const scrollToForm = () => {
    // Check if we're on the home page where the form exists
    if (
      location.pathname === "/" ||
      location.pathname === "/posts" ||
      location.pathname === "/posts/search"
    ) {
      const formElement = document.querySelector("form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      // If we're on a post details page, navigate to home page
      navigate("/posts");
    }
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
            e.target.src = null;
            e.target.style.backgroundColor = "#0E7C66";
            e.target.innerHTML = user.result.name.charAt(0);
          }}
        />
      );
    }

    return (
      <Avatar
        className={classes.purple}
        alt={user.result.name}
        style={{ backgroundColor: "#0E7C66" }}
      >
        {user.result.name.charAt(0)}
      </Avatar>
    );
  };

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.brandContainer}>
        <Link
          to="/"
          className={classes.brandContainer}
          style={{ textDecoration: "none", color: "black" }}
        >
          <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>Blogify</h1>
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
              color="primary"
              onClick={scrollToForm}
              className={classes.createButton}
              size={isLargeScreen ? "medium" : "small"}
            >
              Create
            </Button>

            <Button
              variant="contained"
              className={classes.logout}
              color="secondary"
              onClick={logout}
              size={isLargeScreen ? "medium" : "small"}
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
