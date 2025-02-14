import * as api from "../api";
import { AUTH } from "../constants/actionTypes";

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
    navigate("/");
  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  }
};

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
    navigate("/");
  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  }
};

export const googleSignIn = (userData, navigate) => async (dispatch) => {
  try {
    // Send Google user data to backend
    const { data } = await api.googleSignIn(userData);

    dispatch({ type: AUTH, data });
    navigate("/");
  } catch (error) {
    console.log("Error in googleSignIn action:", error);
    alert(error.response?.data?.message || "Google Sign In failed");
  }
};
