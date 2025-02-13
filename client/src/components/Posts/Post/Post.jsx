import React, { useState, useEffect } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Box,
} from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deletePost, likePost } from '../../../actions/posts';

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const navigate = useNavigate();
  const userId = user?.result?.googleId || user?.result?._id;
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Debug logging
    console.log('Post ID:', post._id);
    console.log('Original Image Source:', post.selectedFile);

    if (post.selectedFile) {
      // Check if it's a base64 string
      if (post.selectedFile.startsWith('data:image')) {
        setImageUrl(post.selectedFile);
      }
      // Check if it's a URL
      else if (post.selectedFile.startsWith('http')) {
        setImageUrl(post.selectedFile);
      }
      // If neither, log error
      else {
        console.error('Invalid image format:', post.selectedFile.substring(0, 50) + '...');
        setImageError(true);
      }
    }
  }, [post.selectedFile]);

  const Likes = () => {
    if (post?.likes?.length > 0) {
      return post.likes.includes(userId)
        ? (<><ThumbUpAltIcon fontSize="small" /> {post.likes.length} {post.likes.length > 1 ? 'Likes' : 'Like'}</>)
        : (<><ThumbUpAltOutlined fontSize="small" /> {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</>);
    }
  };

  const openPost = () => navigate(`/posts/${post._id}`);

  const handleImageError = (e) => {
    console.error('Image load error:', e);
    setImageError(true);
  };

  const renderImage = () => {
    if (imageError || !imageUrl) {
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
            bgcolor: 'rgba(0, 0, 0, 0.12)',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            No image available
          </Typography>
        </Box>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={post.title}
        onError={handleImageError}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        loading="lazy"
        crossOrigin="anonymous"
      />
    );
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        borderRadius: '15px',
        bgcolor: 'background.paper',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
      }}
      elevation={3}
    >
      <Box
        onClick={openPost}
        sx={{
          cursor: 'pointer',
          position: 'relative',
          paddingTop: '56.25%',
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}
      >
        {renderImage()}
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Posted by {post.name} • {moment(post.createdAt).fromNow()}
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
          {post.title}
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {post.tags.map((tag) => `#${tag} `)}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {post.message}
        </Typography>
      </CardContent>

      <CardActions sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        pb: 2,
      }}>
        <Button
          size="small"
          color="primary"
          disabled={!user?.result}
          onClick={() => dispatch(likePost(post._id))}
          startIcon={<ThumbUpAltOutlined />}
        >
          <Likes />
        </Button>

        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
          <Box>
            <Button
              size="small"
              color="primary"
              onClick={() => setCurrentId(post._id)}
              sx={{ mr: 1 }}
            >
              <EditIcon fontSize="small" />
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => dispatch(deletePost(post._id))}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;