import React, { useEffect } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import useStyles from "./styles";
import { getPost, getPostsBySearch } from "../../actions/posts";
import CommentSection from "./CommentSection";

const PostDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const { id } = useParams();

  const { post, posts, isLoading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (id) {
      dispatch(getPost(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (post) {
      dispatch(
        getPostsBySearch({ search: "none", tags: post?.tags.join(",") })
      );
    }
  }, [post]);

  if (isLoading || !post) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(
    ({ _id, id }) => (id || _id) !== (post.id || post._id)
  );

  if (!post || Object.keys(post).length === 0) {
    return (
      <Paper
        elevation={6}
        style={{ padding: "20px", borderRadius: "15px", textAlign: "center" }}
      >
        <Typography variant="h5">No Post Found</Typography>
      </Paper>
    );
  }

  const openPost = (_id) => {
    navigate(`/posts/${_id}`);
  };

  return (
    <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags?.map((tag) => `#${tag} `).join(" ")}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {post.message}
          </Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">
            {moment(post.created_at || post.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <CommentSection post={post} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={classes.imageSection}>
                <img
                  className={classes.media}
                  src={
                    post.selectedFile ||
                    "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
                  }
                  alt={post.title}
                />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      {!!recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">
            You might also like:
          </Typography>
          <Divider />
          <Grid container spacing={3}>
            {recommendedPosts.map(
              ({ title, name, message, likes, selectedFile, _id, id }) => (
                <Grid item xs={12} sm={6} md={4} key={id || _id}>
                  <Card
                    className={classes.recommendedPostCard}
                    onClick={() => openPost(id || _id)}
                  >
                    <CardMedia
                      className={classes.recommendedPostImage}
                      image={
                        selectedFile ||
                        "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
                      }
                      title={title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6">
                        {title}
                      </Typography>
                      <Typography variant="subtitle2">{name}</Typography>
                      <Typography variant="subtitle2">{message}</Typography>
                      <Typography variant="subtitle1">
                        Likes: {likes.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </div>
      )}
    </Paper>
  );
};

export default PostDetails;
