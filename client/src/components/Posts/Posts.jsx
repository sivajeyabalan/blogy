import React from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import useStyles from "./styles";

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const classes = useStyles();

  // Check if posts is undefined or empty, and handle the loading state
  if (!posts || posts.length === 0) {
    if (isLoading) return <CircularProgress />;
    return 'No posts';
  }

  return (
    <Grid
      className={classes.container}
      container
      alignItems={"stretch"}
      spacing={2}
    >
      {posts.map((post) => (
        <Grid key={post._id} item xs={12} sm={12} md={6} lg={4}>
          <Post post={post} setCurrentId={setCurrentId} />
        </Grid>
      ))}
    </Grid>
  );
};


export default Posts;