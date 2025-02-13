import * as api from "../api";
import { AUTH } from "../constants/actionTypes";

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
    navigate("/");
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
    navigate("/");
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const googleSignIn = (token, navigate) => async (dispatch) => {
  try {
    const { data } = await api.googleSignIn(token);
    dispatch({ type: AUTH, data });
    localStorage.setItem("profile", JSON.stringify(data));
    navigate("/");
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};
