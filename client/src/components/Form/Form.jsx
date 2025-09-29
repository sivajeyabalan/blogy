import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Box,
  LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost, updatePost } from "../../actions/posts";
import useStyles from "./styles";
import axios from "axios";

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const post = useSelector((state) =>
    currentId
      ? state.posts.posts.find((p) => (p.id || p._id) === currentId)
      : null
  );

  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    if (post) {
      const formattedTags = Array.isArray(post.tags)
        ? post.tags.join(",")
        : post.tags;

      setPostData({
        ...post,
        tags: formattedTags,
      });
    }
  }, [post]);

  // Create a preview URL when a File is selected
  useEffect(() => {
    if (postData.selectedFile instanceof File) {
      const url = URL.createObjectURL(postData.selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (typeof postData.selectedFile === "string") {
      setPreviewUrl(postData.selectedFile);
    } else {
      setPreviewUrl("");
    }
  }, [postData.selectedFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = postData.title.trim();

    if (trimmedTitle === "") {
      alert("Title cannot be empty after trimming.");
      return;
    }

    const formattedTags = postData.tags
      ? postData.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag !== "")
      : [];

    // Remove ID and other fields that shouldn't be sent to server
    const {
      id,
      _id,
      creator,
      likes,
      comments,
      created_at,
      updated_at,
      user_name,
      user_image_url,
      ...cleanPostData
    } = postData;

    const postPayload = {
      ...cleanPostData,
      tags: formattedTags,
      title: trimmedTitle,
      name: user?.result?.name,
    };

    console.log(
      "🔍 Form handleSubmit - currentId:",
      currentId,
      "type:",
      typeof currentId
    );

    if (
      currentId === 0 ||
      currentId === null ||
      currentId === undefined ||
      currentId === "null" ||
      currentId === "undefined"
    ) {
      console.log("🔍 Creating new post");
      dispatch(createPost(postPayload, navigate));
    } else {
      console.log("🔍 Updating existing post with ID:", currentId);
      dispatch(updatePost(currentId, postPayload));
    }
    clear();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostData({ ...postData, selectedFile: file });
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please sign in to create your Memories like others
        </Typography>
      </Paper>
    );
  }

  const clear = () => {
    setCurrentId(null);
    setPostData({
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Typography variant="h6">
            {currentId && post ? `Editing "${post.title}"` : "Create a Memory"}
          </Typography>

          <TextField
            name="title"
            variant="outlined"
            label="Title"
            placeholder="Give your memory a title"
            fullWidth
            value={postData.title}
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          />

          <TextField
            name="message"
            variant="outlined"
            label="Message"
            placeholder="Share the story behind this moment..."
            fullWidth
            multiline
            rows={4}
            value={postData.message}
            onChange={(e) =>
              setPostData({ ...postData, message: e.target.value })
            }
          />

          <TextField
            name="tags"
            variant="outlined"
            label="Tags"
            placeholder="e.g. travel, family, 2025"
            helperText="Separate tags with commas"
            fullWidth
            value={postData.tags}
            onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
          />

          <Box className={classes.uploadArea}>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={classes.hiddenInput}
            />
            <label htmlFor="file-input">
              <Button
                component="span"
                startIcon={<CloudUploadIcon />}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                {postData.selectedFile ? "Change Image" : "Upload Image"}
              </Button>
            </label>
            {loading && <LinearProgress sx={{ width: "100%", mt: 1 }} />}
          </Box>

          {previewUrl && (
            <Box className={classes.previewWrapper}>
              <img className={classes.preview} src={previewUrl} alt="Preview" />
            </Box>
          )}

          <Button
            className={`${classes.buttonSubmit}`}
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            fullWidth
          >
            Submit
          </Button>
          <Button
            className={`${classes.buttonClear}`}
            variant="outlined"
            color="secondary"
            size="small"
            onClick={clear}
            fullWidth
          >
            Clear
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default Form;
