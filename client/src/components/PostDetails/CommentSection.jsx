import React, { useState, useRef, useEffect } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import useStyles from "./styles";
import { commentPost } from "../../actions/posts";

const CommentSection = ({ post }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("profile"));
  const commentsRef = useRef(null);

  // Update comments when post changes
  useEffect(() => {
    if (post?.comments && Array.isArray(post.comments)) {
      setComments(post.comments);
    } else {
      setComments([]);
    }
  }, [post]);

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [comments]);

  const handleClick = async () => {
    if (!comment.trim() || !user?.result?.name) return;

    const finalComment = `${user.result.name}: ${comment}`;
    const postId = post?.id || post?._id;

    if (!postId) {
      console.error("No post ID available for commenting");
      return;
    }

    try {
      const newComments = await dispatch(commentPost(finalComment, postId));
      if (newComments && Array.isArray(newComments)) {
        setComments(newComments);
        setComment("");
      } else {
        // If the API doesn't return comments, add it locally
        setComments((prev) => [...prev, finalComment]);
        setComment("");
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Add comment locally as fallback
      setComments((prev) => [...prev, finalComment]);
      setComment("");
    }
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          {comments && comments.length > 0 ? (
            comments.map((c, i) => (
              <Typography
                key={i}
                gutterBottom
                variant="subtitle1"
                ref={i === comments.length - 1 ? commentsRef : null}
              >
                <strong>{c.split(":")[0]}</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                {c.split(":")[1]}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </div>
      </div>

      {user?.result?.name && (
        <div className={classes.commentBox}>
          <TextField
            className={classes.commentInput}
            fullWidth
            rows={4}
            variant="outlined"
            label="Write a Comment"
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            style={{ marginTop: "10px" }}
            fullWidth
            disabled={!comment}
            variant="contained"
            onClick={handleClick}
            className={classes.commentButton}
          >
            Comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
