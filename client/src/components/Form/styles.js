import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(3),
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    background: "#fff",
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  fileInput: {
    width: "97%",
    margin: "10px 0",
  },
  uploadArea: {
    display: "block",
    width: "100%",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    border: 0,
  },
  previewWrapper: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
    background: "#fafafa",
  },
  preview: {
    display: "block",
    width: "100%",
    height: 220,
    objectFit: "cover",
  },
  buttonSubmit: {
    marginBottom: theme.spacing(2),
  },
  buttonClear: {
    marginTop: theme.spacing(2),
  },
}));
