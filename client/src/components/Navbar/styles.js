import { makeStyles } from "@mui/styles";
import { deepPurple } from "@mui/material/colors";

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: "30px 0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 50px",
    backdropFilter: "saturate(180%) blur(4px)",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      padding: "10px 20px",
    },
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
  },
  image: {
    marginLeft: "10px",
    marginTop: "5px",
  },
  toolbar: {
    width: "auto",
    padding: 0,
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logout: {
    marginLeft: "10px",
  },
  userName: {
    marginRight: "10px",
  },
  purple: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    backgroundColor: theme.palette.primary.main,
  },
  profileButton: {
    marginLeft: "20px",
    marginRight: "20px",
  },
}));
