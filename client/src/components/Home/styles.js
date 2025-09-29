import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  appBarSearch: {
    borderRadius: 12,
    marginBottom: "1rem",
    display: "flex",
    padding: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    background: "#fff",
  },
  pagination: {
    borderRadius: 12,
    marginTop: "1rem",
    padding: "16px",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  gridContainer: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column-reverse",
    },
  },
}));
