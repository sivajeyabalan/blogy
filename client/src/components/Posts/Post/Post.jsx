import React, { useState, useEffect } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Box,
  Skeleton,
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

  // Like functionality from the given reference code
  const [likes, setLikes] = useState(post?.likes || []);

  useEffect(() => {
    setLikes(post?.likes || []);
  }, [post.likes]);

  const hasLikedPost = likes.includes(userId);

  const handleLike = async () => {
    dispatch(likePost(post._id));

    if (hasLikedPost) {
      setLikes(likes.filter((id) => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId) ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {likes.length > 2
            ? `You and ${likes.length - 1} others`
            : `${likes.length} like${likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
            sx={{ position: 'absolute', top: 0, left: 0 }}
          />
        )}
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
      </>
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
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        },
      }}
      elevation={2}
    >
      <Box
        onClick={() => navigate(`/posts/${post._id}`)}
        sx={{
          cursor: 'pointer',
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderRadius: '15px 15px 0 0',
          overflow: 'hidden',
        }}
      >
        {renderImage()}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {moment(post.createdAt).fromNow()}
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          {post.title}
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          {post.tags.map((tag) => `#${tag} `)}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
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

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button>

        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
          <>
            <Button size="small" color="primary" onClick={() => setCurrentId(post._id)}>
              <EditIcon fontSize="small" />
            </Button>
            <Button size="small" color="error" onClick={() => dispatch(deletePost(post._id))}>
              <DeleteIcon fontSize="small" />
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;
