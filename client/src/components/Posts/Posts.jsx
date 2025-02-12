import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import useStyles from "./styles";

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const classes = useStyles();

  // Check if posts is undefined or empty, and handle the loading state
  if (!posts?.length && !isLoading) return 'No posts';
  console.log(posts);

  return (
    isLoading ? (
      <CircularProgress />
    ) : (
      <Box className={classes.container} display="flex" flexWrap="wrap" gap={2}>
        {posts?.map((post) => (
          <Box key={post._id} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }}>
            <Post post={post} setCurrentId={setCurrentId} />
          </Box>
        ))}
      </Box>
    )
  );
};

export default Posts;
