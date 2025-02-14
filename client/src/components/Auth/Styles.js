import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    maxWidth: "400px",
    width: "90%",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
  },
  container: {
    position: "relative",
    minHeight: "calc(100vh - 64px)", // Subtract navbar height
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
  },
  googleButtonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    "& > div": {
      width: "100% !important",
    },
    "& > div > iframe": {
      width: "100% !important",
    },
  },
  buttonDivider: {
    margin: theme.spacing(2, 0),
    width: "100%",
    textAlign: "center",
    position: "relative",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      width: "45%",
      height: "1px",
      backgroundColor: theme.palette.divider,
    },
    "&::before": {
      left: 0,
    },
    "&::after": {
      right: 0,
    },
  },
}));
