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

    // If searchQuery is "none", treat it as null/empty for title search
    const actualSearchQuery =
      searchQuery === "none" || searchQuery === "" ? null : searchQuery;

    const posts = await findPostsBySearch(actualSearchQuery, tagArray);

    res.json({ data: posts });
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ message: "Failed to search posts" });
  }
};

export const createPostController = async (req, res) => {
  try {
    console.log("Creating post with data:", req.body);
    console.log("File uploaded:", req.file ? "Yes" : "No");

    // Parse tags if they're sent as JSON string
    let tags = req.body.tags;
    if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        // If parsing fails, treat as comma-separated string
        tags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");
      }
    }

    const postData = {
      ...req.body,
      tags: tags,
      creator: req.userId,
      likes: [],
      comments: [],
    };

    // Handle file upload with timeout protection
    if (req.file) {
      try {
        if (req.file.path) {
          postData.selectedFile = req.file.path;
          console.log("File uploaded to Cloudinary:", req.file.path);
        } else {
          console.log("File uploaded but no path available:", req.file);
          postData.selectedFile = ""; // No image
        }
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        postData.selectedFile = ""; // Fallback to no image
      }
    } else if (req.body.selectedFile) {
      // Handle case where selectedFile is passed in body (no file upload)
      postData.selectedFile = req.body.selectedFile;
    } else {
      // No file provided, set empty string
      postData.selectedFile = "";
    }

    // Map camelCase to snake_case for database
    if (postData.selectedFile !== undefined) {
      postData.selected_file = postData.selectedFile;
      delete postData.selectedFile;
    }

    console.log("Final post data:", postData);
    const newPost = await createPost(postData);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    console.error("Error details:", error.message);
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};

export const updatePostController = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  console.log("🔍 updatePostController - id:", id, "type:", typeof id);

  try {
    // Map camelCase to snake_case for database
    const updateData = {
      title,
      message,
      creator,
      selected_file: selectedFile, // Map selectedFile to selected_file
      tags,
    };

    const updatedPost = await updatePost(id, updateData);
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

  console.log("🔴 likePostController called", {
    postId: id,
    userId: req.userId,
    headers: req.headers,
    authHeader: req.headers.authorization,
  });

  if (!req.userId) {
    console.log("🔴 Unauthorized - no userId");
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    console.log("🔴 Calling likePost query with:", { id, userId: req.userId });
    const updatedPost = await likePost(id, req.userId);
    console.log("🔴 likePost query result:", updatedPost);
    res.json(updatedPost);
  } catch (error) {
    console.error("🔴 Error liking post:", error);
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
