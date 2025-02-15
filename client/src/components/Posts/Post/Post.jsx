import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Skeleton,
  IconButton,
  Tooltip,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { deletePost, likePost } from '../../actions/posts';

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));
  const userId = user?.result?.googleId || user?.result?._id;

  const [likes, setLikes] = useState(post?.likes || []);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setLikes(post?.likes || []);
  }, [post?._id, post?.likes]);

  const hasLikedPost = likes.includes(userId);
  const isOwner = userId === post?.creator;

  const handleLike = async () => {
    if (!userId || isProcessingLike) return;

    try {
      setIsProcessingLike(true);
      // Optimistic update
      const newLikes = hasLikedPost
        ? likes.filter(id => id !== userId)
        : [...likes, userId];
      setLikes(newLikes);

      await dispatch(likePost(post._id));
    } catch (error) {
      // Revert on error
      setLikes(likes);
      console.error('Failed to update like:', error);
    } finally {
      setIsProcessingLike(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await dispatch(deletePost(post._id, navigate));
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setCurrentId(post._id);
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const openPost = () => navigate(`/posts/${post._id}`);

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
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Image unavailable
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
            sx={{ position: 'absolute', top: 0, left: 0 }}
          />
        )}
        {post.selectedFile && (
          <img
            src={post.selectedFile}
            alt={post.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none',
            }}
          />
        )}
      </>
    );
  };

  const LikeButton = () => (
    <Tooltip title={userId ? (hasLikedPost ? 'Unlike' : 'Like') : 'Sign in to like posts'}>
      <span>
        <IconButton
          size="small"
          color="primary"
          disabled={!userId || isProcessingLike}
          onClick={handleLike}
          sx={{ opacity: isProcessingLike ? 0.7 : 1 }}
        >
          {hasLikedPost ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        borderRadius: 2,
        bgcolor: 'background.paper',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
      elevation={2}
    >
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          cursor: 'pointer',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
        }}
        onClick={openPost}
      >
        {renderImage()}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            p: 1,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          }}
        >
          <Typography variant="body2" color="white">
            {post.name}
          </Typography>
          <Typography variant="caption" color="white">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </Typography>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.tags.map((tag) => `#${tag} `)}
        </Typography>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
          }}
        >
          {post.message}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LikeButton />
          <Typography variant="body2" color="textSecondary">
            {likes.length > 0 && likes.length}
          </Typography>

          <Tooltip title="View details">
            <IconButton size="small" onClick={openPost}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {isOwner && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit post">
              <IconButton size="small" color="primary" onClick={handleEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete post">
              <IconButton
                size="small"
                color="error"
                onClick={handleDelete}
                disabled={isDeleting}
                sx={{ opacity: isDeleting ? 0.7 : 1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;