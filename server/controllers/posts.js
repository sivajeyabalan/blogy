import express from "express";
import { Prisma } from "@prisma/client";
import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/database.js";

const router = express.Router();

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

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
    const total = await prisma.post.count();
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: LIMIT,
      skip: startIndex,
    });
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
    const whereClause = {};

    if (searchQuery && searchQuery.trim()) {
      whereClause.title = {
        contains: searchQuery.trim(),
        mode: "insensitive",
      };
    }

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      whereClause.tags = {
        hasSome: tagArray,
      };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
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

    const newPost = await prisma.post.create({
      data: {
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
        likes: [],
        comments: [],
      },
    });

    res.status(201).json(newPost);
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

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

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
    };

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
    });

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
    const post = await prisma.post.findUnique({
      where: { id },
    });

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

    await prisma.post.delete({
      where: { id },
    });

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

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likes = post.likes || [];
    const index = likes.findIndex((userId) => userId === String(req.userId));

    if (index === -1) {
      likes.push(String(req.userId));
    } else {
      likes.splice(index, 1);
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { likes },
    });

    res.json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to like post", error: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = post.comments || [];
    comments.push(value);

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { comments },
    });

    res.json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to comment on post", error: error.message });
  }
};

export default router;
