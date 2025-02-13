import * as api from "../api";
import { AUTH } from "../constants/actionTypes";

export const signin =
  (formData, navigate, setIsSignup, setFormData) => async (dispatch) => {
    try {
      const { data } = await api.signIn(formData);
      dispatch({ type: AUTH, data });
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");

      // Redirect to Signup if user doesn't exist
      if (error.response?.data?.redirect === "signup") {
        setIsSignup(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    }
  };

export const signup =
  (formData, navigate, setIsSignup, setFormData) => async (dispatch) => {
    try {
      const { data } = await api.signUp(formData);
      dispatch({ type: AUTH, data });
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");

      // Redirect to Signin if user already exists
      if (error.response?.data?.redirect === "signin") {
        setIsSignup(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    }
  };

export const googleSignIn = (token, navigate) => async (dispatch) => {
  try {
    const { data } = await api.googleSignIn(token); // Send token to backend
    dispatch({ type: AUTH, data });
    localStorage.setItem("profile", JSON.stringify(data));
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};
