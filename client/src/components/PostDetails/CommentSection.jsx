import React, { useState, useRef, useEffect } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import useStyles from './styles';
import { commentPost } from '../../actions/posts';

const CommentSection = ({ post }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [comments, setComments] = useState(post?.comments || []);
    const [comment, setComment] = useState('');
    const user = JSON.parse(localStorage.getItem('profile'));
    const commentsRef = useRef(null);

    useEffect(() => {
        if (commentsRef.current) {
            commentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [comments]);

    const handleClick = async () => {
        const finalComment = `${user.result.name}: ${comment}`;

        const newComments = await dispatch(commentPost(finalComment, post._id));

        setComments(newComments);
        setComment('');
    };

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {comments.map((c, i) => (
                        <Typography key={i} gutterBottom variant="subtitle1" ref={i === comments.length - 1 ? commentsRef : null}>
                            <strong>{c.split(':')[0]}</strong>&nbsp;&nbsp;&nbsp;&nbsp;{c.split(':')[1]}
                        </Typography>
                    ))}
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
                        style={{ marginTop: '10px' }}
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
