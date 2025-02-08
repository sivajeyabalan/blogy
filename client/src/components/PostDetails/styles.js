import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  media: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "15px",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: "15px",
    height: "100%",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  imageSection: {
    flex: 1.2,
    paddingRight: "20px",
    marginLeft: "4px",
    [theme.breakpoints.down("sm")]: {
      paddingRight: 0,
      marginBottom: "20px",
    },
  },
  section: {
    flex: 1.8,
    [theme.breakpoints.down("sm")]: {
      flex: "unset",
    },
  },
  recommendedPostCard: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    cursor: "pointer",
  },
  recommendedPostImage: {
    height: 200,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  border: {
    border: "solid",
  },
  fullHeightCard: {
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "white",
  },
  overlay2: {
    position: "absolute",
    top: "20px",
    right: "20px",
    color: "white",
  },
  grid: {
    display: "flex",
  },
  details: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px",
  },
  title: {
    padding: "0 16px",
  },
  cardActions: {
    padding: "0 16px 8px 16px",
    display: "flex",
    justifyContent: "space-between",
  },
  cardAction: {
    display: "block",
    textAlign: "initial",
  },
  commentsOuterContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  commentsInnerContainer: {
    height: "200px",
    overflowY: "auto",
    marginRight: "30px",
  },
}));
