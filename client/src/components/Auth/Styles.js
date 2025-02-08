import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    maxWidth: "400px",
    width: "100%",
    margin: "0 auto",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2), // This adds consistent spacing between buttons
    marginTop: theme.spacing(3),
  },
  submit: {
    padding: "12px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  googleButtonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    "& > div": {
      width: "100% !important",
    },
    "& > div > iframe": {
      width: "100% !important",
    },
    "@media (forced-colors: active)": {
      "& button": {
        border: "2px solid currentColor",
      },
    },
  },
  switchButton: {
    textTransform: "none",
    fontSize: "14px",
    color: theme.palette.primary.main,
  },
}));
