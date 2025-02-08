import { makeStyles } from "@mui/styles";

export default makeStyles({
  media: {
    height: 0,
    paddingTop: "56.25%", // Aspect ratio
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backgroundBlendMode: "darken",
    width: "100%", // Ensures full width inside ButtonBase
    objectFit: "cover", // Ensures proper image scaling
  },
  border: {
    border: "solid",
  },
  fullHeightCard: {
    height: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "15px",
    height: "100%",
    position: "relative",
    overflow: "hidden", // Prevent collapsing issues
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
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%", // Ensures ButtonBase doesn't shrink the card
    textAlign: "initial",
  },
  editIcon: {
    transition: "transform 0.3s ease", // Smooth transition for scaling
    "&:hover": {
      transform: "scale(1.3)", // Scale the icon up on hover
    },
  },
});
