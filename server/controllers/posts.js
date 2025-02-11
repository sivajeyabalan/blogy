import express from "express";
import mongoose from "mongoose";
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
    const posts_s = await PostMessage.find(); // This should return all posts if there are any
    console.log(posts_s);
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    console.log("Posts from MongoDB:", posts); // Debugging
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

    console.log("Posts Found:", posts);
    res.json({ data: posts });
  } catch (error) {
    console.log("Error in getPostsBySearch:", error);
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  if (!req.userId) {
    return res.status(403).json({ message: "Unauthorized - No User ID" });
  }

  const newPost = new PostMessage({
    ...post,
    creator: String(req.userId), // Convert to string to avoid issues
    createdAt: new Date(),
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No Posts with that id");

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  );

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Post with  that id");

  await PostMessage.findByIdAndDelete(id);

  res.json({ message: "Post deleted successfully " });
};
export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.status(403).json({ message: "Unauthorized" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Post with that id");

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((userId) => userId === String(req.userId));

  if (index === -1) {
    // Like the post
    post.likes.push(String(req.userId));
  } else {
    // Unlike the post
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
