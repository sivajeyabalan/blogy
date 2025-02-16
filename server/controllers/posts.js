import express from "express";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import PostMessage from "../models/postMessage.js";

const router = express.Router();

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 9;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await PostMessage.countDocuments({});
    const posts_s = await PostMessage.find();
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    res.json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery?.trim() || "", "i");
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, message, tags, selectedFile, name } = req.body;

  if (!req.userId) {
    return res.status(403).json({ message: "Unauthorized - No User ID" });
  }

  if (!title || !message) {
    return res.status(400).json({ message: "Title and message are required" });
  }

  try {
    let imageUrl = null;

    if (selectedFile) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(selectedFile, {
          folder: "MemoriesApp",
          resource_type: "auto",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    const newPost = new PostMessage({
      title: title.trim(),
      message: message.trim(),
      tags: Array.isArray(tags)
        ? tags
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0)
        : tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0),
      selectedFile: imageUrl,
      creator: req.userId,
      name: name.trim(),
      createdAt: new Date(),
      likes: [],
      comments: [],
    });

    const savedPost = await newPost.save();
    if (!savedPost) {
      return res.status(400).json({ message: "Failed to save post" });
    }

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error Creating Post:", error);
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, tags, selectedFile, name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid post ID" });
  }

  try {
    const existingPost = await PostMessage.findById(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.creator !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    let imageUrl = existingPost.selectedFile;

    if (selectedFile && selectedFile !== existingPost.selectedFile) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(selectedFile, {
          folder: "MemoriesApp",
          resource_type: "auto",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload new image" });
      }
    }

    const updateData = {
      title: title?.trim() || existingPost.title,
      message: message?.trim() || existingPost.message,
      tags: tags
        ? Array.isArray(tags)
          ? tags
              .map((tag) => tag.trim().toLowerCase())
              .filter((tag) => tag.length > 0)
          : tags
              .split(",")
              .map((tag) => tag.trim().toLowerCase())
              .filter((tag) => tag.length > 0)
        : existingPost.tags,
      selectedFile: imageUrl,
      name: name?.trim() || existingPost.name,
      lastModified: new Date(),
    };

    const updatedPost = await PostMessage.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return res.status(400).json({ message: "Failed to update post" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error Updating Post:", error);
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
};
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid post ID" });
    }

    const post = await PostMessage.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.creator !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    if (post.selectedFile && post.selectedFile.includes("cloudinary")) {
      try {
        const publicId = post.selectedFile.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`MemoriesApp/${publicId}`);
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete image from Cloudinary:",
          cloudinaryError
        );
      }
    }

    await PostMessage.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete post", error: error.message });
  }
};
export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.status(403).json({ message: "Unauthorized" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Post with that id");

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((userId) => userId === String(req.userId));

  if (index === -1) {
    post.likes.push(String(req.userId));
  } else {
    post.likes = post.likes.filter((userId) => userId !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(id);

  post.comments.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export default router;
