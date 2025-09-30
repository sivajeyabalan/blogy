import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import useStyles from "./styles";

const Posts = ({ setCurrentId }) => {
  const { posts, searchResults, isLoading } = useSelector(
    (state) => state.posts
  );
  const classes = useStyles();

  // Use search results if available, otherwise use regular posts
  const displayPosts =
    searchResults && searchResults.length > 0 ? searchResults : posts;

  if (!displayPosts?.length && !isLoading) return "No posts";

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Box className={classes.container} display="flex" flexWrap="wrap" gap={2}>
      {displayPosts?.map((post) => (
        <Box
          key={post.id || post._id}
          sx={{ width: { xs: "100%", sm: "48%", md: "30%" } }}
        >
          <Post post={post} setCurrentId={setCurrentId} />
        </Box>
      ))}
    </Box>
  );
};

export default Posts;
