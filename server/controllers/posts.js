import {
  createPost,
  findPostById,
  findPosts,
  countPosts,
  findPostsBySearch,
  updatePost,
  deletePost,
  likePost,
  commentPost,
} from "../database/queries.js";

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 9;
    const currentPage = Number(page) || 1;

    // Get posts and total count in parallel
    const [posts, total] = await Promise.all([
      findPosts(currentPage, LIMIT),
      countPosts(),
    ]);

    res.json({
      data: posts,
      currentPage,
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await findPostById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : null;
    const posts = await findPostsBySearch(searchQuery, tagArray);

    res.json({ data: posts });
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ message: "Failed to search posts" });
  }
};

export const createPostController = async (req, res) => {
  try {
    const postData = {
      ...req.body,
      creator: req.userId,
      likes: [],
      comments: [],
    };

    // If there's a file uploaded, use the Cloudinary URL
    if (req.file) {
      postData.selectedFile = req.file.path;
    }

    const newPost = await createPost(postData);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePostController = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  try {
    const updatedPost = await updatePost(id, {
      title,
      message,
      creator,
      selectedFile,
      tags,
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePostController = async (req, res) => {
  const { id } = req.params;

  try {
    await deletePost(id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const likePostController = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const updatedPost = await likePost(id, req.userId);
    res.json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Failed to like post" });
  }
};

export const commentPostController = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  try {
    const updatedPost = await commentPost(id, value);
    res.json(updatedPost);
  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({ message: "Failed to comment on post" });
  }
};
