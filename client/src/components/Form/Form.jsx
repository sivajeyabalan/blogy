import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost, updatePost } from "../../actions/posts";
import useStyles from "./styles";
import axios from "axios"; // Import axios

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const [loading, setLoading] = useState(false); // For image upload status

  const post = useSelector((state) =>
    currentId ? state.posts.posts.find((p) => p._id === currentId) : null
  );

  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = postData.title.trim();

    if (trimmedTitle === "") {
      alert("Title cannot be empty after trimming.");
      return;
    }

    // Convert tags to an array only on submit
    const formattedTags = postData.tags
      ? postData.tags.split(",").map(tag => tag.trim().toLowerCase()).filter(tag => tag !== "")
      : [];

    if (currentId === 0) {
      dispatch(createPost({ ...postData, tags: formattedTags, title: trimmedTitle, name: user?.result?.name }, navigate));
    } else {
      dispatch(updatePost(currentId, { ...postData, tags: formattedTags, title: trimmedTitle, name: user?.result?.name }));
    }
    clear();
  };



  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get the uploaded file

    if (!file) return;

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "MemoriesApp"); // Make sure this is set in Cloudinary

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/de0dsslun/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      });

      setPostData({ ...postData, selectedFile: res.data.secure_url }); // Store Cloudinary URL
    } catch (error) {
      console.error("Image Upload Error:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); // Stop loading
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
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post.title}"` : "Creating a Memory"}</Typography>
        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags (comma separated)"
          fullWidth
          value={postData.tags}
          onChange={(e) => setPostData({ ...postData, tags: e.target.value })} // Store as string while typing
        />

        <input type="file" accept="image/*" onChange={handleFileChange} />
        {loading && <p>Uploading image...</p>} {/* Show loading text while uploading */}
        {postData.selectedFile && <img src={postData.selectedFile} alt="Uploaded" style={{ width: "100px", height: "100px", marginTop: "10px" }} />}
        <Button className={`${classes.buttonSubmit}`} variant="contained" color="primary" size="large" type="submit" fullWidth>
          Submit
        </Button>
        <Button className={`${classes.buttonClear}`} variant="contained" color="secondary" size="small" onClick={clear} fullWidth>
          Clear
        </Button>

      </form>
    </Paper>
  );
};

export default Form;
