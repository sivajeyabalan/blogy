import express from "express";
import {
  getPost,
  getPosts,
  createPostController,
  updatePostController,
  deletePostController,
  likePostController,
  getPostsBySearch,
  commentPostController,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/search", getPostsBySearch);
router.get("/:id", getPost);
router.post("/", auth, upload.single("file"), createPostController);
router.patch("/:id", auth, updatePostController);
router.delete("/:id", auth, deletePostController);
router.patch("/:id/likePost", auth, likePostController);
router.patch("/:id/commentPost", auth, commentPostController);

// Test route for debugging (remove in production)
router.post("/test", upload.single("file"), (req, res) => {
  res.json({
    message: "Test endpoint working",
    body: req.body,
    file: req.file ? "File received" : "No file",
  });
});

export default router;
