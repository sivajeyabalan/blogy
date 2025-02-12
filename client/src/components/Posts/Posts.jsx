import React from "react";
import { Grid2 as Grid, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import useStyles from "./styles";

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const classes = useStyles();

  if (!posts?.length && !isLoading) return 'No posts';
  console.log(posts);

  return (
    isLoading ? <CircularProgress /> : (
      <Grid
        className={classes.container}
        container
        alignItems={"stretch"}
        spacing={2}
      >
        {posts.map((post) => (
          <Grid key={post._id} xs={12} sm={12} md={6} lg={4}>
            <Post post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Posts;
