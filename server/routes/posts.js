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
router.patch("/:id", auth, upload.single("file"), updatePostController);
router.delete("/:id", auth, deletePostController);
router.patch("/:id/likePost", auth, likePostController);
router.patch("/:id/commentPost", auth, commentPostController);

// Test route for debugging (remove in production)
router.post("/test", upload.single("file"), (req, res) => {
  res.json({
    message: "Test endpoint working",
    body: req.body,
    file: req.file ? "File received" : "No file",
    fileDetails: req.file
      ? {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          hasPath: !!req.file.path,
          hasBuffer: !!req.file.buffer,
        }
      : null,
  });
});

// Simple test route without file upload
router.post("/test-simple", (req, res) => {
  res.json({
    message: "Simple test endpoint working",
    body: req.body,
    headers: req.headers,
  });
});

export default router;
