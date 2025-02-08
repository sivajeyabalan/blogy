import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    alignItems: "center",
  },
  smMargin: {
    margin: theme.spacing(1),
  },
  actionDiv: {
    textAlign: "center",
  },
  card: {
    borderRadius: "15px",
    maxWidth: "100%",
    aspectRatio: "4/3",
  },
  media: {
    height: "180px",
    borderRadius: "12px 12px 0 0",
  },
}));
