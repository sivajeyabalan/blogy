import React, { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deletePost, likePost } from "../../../actions/posts";

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const navigate = useNavigate();
  const userId = user?.result?.googleId || user?.result?._id;
  const [isDeleting, setIsDeleting] = useState(false);
  const [localLikes, setLocalLikes] = useState([]);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setLocalLikes(post?.likes || []);
  }, [post.id || post._id]);

  const hasLikedPost = userId ? localLikes.includes(userId) : false;

  const formatTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string") {
      return tags.split(",").map((tag) => tag.trim().toLowerCase());
    }
    return [];
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await dispatch(deletePost(post.id || post._id, navigate));
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleLike = async () => {
    if (!userId || isProcessingLike) return;

    setIsProcessingLike(true);

    const newLikes = hasLikedPost
      ? localLikes.filter((id) => id !== userId)
      : [...localLikes, userId];

    setLocalLikes(newLikes);

    try {
      await dispatch(likePost(post.id || post._id));
    } catch (error) {
      setLocalLikes(localLikes);
      console.error("Failed to update like:", error);
    } finally {
      setIsProcessingLike(false);
    }
  };

  const handleEdit = () => {
    setCurrentId(post.id || post._id);
    const formElement = document.querySelector("form");
    if (formElement) {
      formElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const renderImage = () => {
    if (imageError) {
      return (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            No image available
          </Typography>
        </Box>
      );
    }

    return (
      <>
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ position: "absolute", top: 0, left: 0 }}
          />
        )}
        <img
          src={post.selectedFile}
          alt={post.title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: imageLoaded ? "block" : "none",
          }}
        />
      </>
    );
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        borderRadius: "15px",
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        },
      }}
      elevation={2}
    >
      <Box
        onClick={() => navigate(`/posts/${post.id || post._id}`)}
        sx={{
          cursor: "pointer",
          position: "relative",
          paddingTop: "56.25%",
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          borderRadius: "15px 15px 0 0",
          overflow: "hidden",
        }}
      >
        {renderImage()}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {moment(post.created_at || post.createdAt).fromNow()}
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          {post.title}
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          {formatTags(post.tags).map((tag, index) => (
            <span key={index}>#{tag} </span>
          ))}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
          }}
        >
          {post.message}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          color="primary"
          disabled={!user?.result || isProcessingLike}
          onClick={handleLike}
          sx={{ opacity: isProcessingLike ? 0.7 : 1 }}
        >
          {hasLikedPost ? (
            <ThumbUpAltIcon color="primary" fontSize="small" />
          ) : (
            <ThumbUpAltOutlined fontSize="small" />
          )}
          &nbsp;{localLikes.length > 0 ? `${localLikes.length} Likes` : "Like"}
        </Button>

        {(user?.result?.googleId === post?.creator ||
          user?.result?._id === post?.creator) && (
          <>
            <Button size="small" color="primary" onClick={handleEdit}>
              <EditIcon fontSize="small" />
            </Button>
            <Button
              size="small"
              color="error"
              onClick={handleDelete}
              disabled={isDeleting}
              sx={{ opacity: isDeleting ? 0.7 : 1 }}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;
