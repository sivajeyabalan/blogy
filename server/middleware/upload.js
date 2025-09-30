import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Create storage with error handling
let storage;
try {
  // Check if Cloudinary credentials are available
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.warn("⚠️ Cloudinary credentials not found, using memory storage");
    storage = multer.memoryStorage();
  } else {
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "memories",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [{ width: 1000, height: 1000, crop: "limit" }],
        timeout: 300000, // 5 minutes timeout
      },
    });
    console.log("✅ Cloudinary storage configured successfully");
  }
} catch (error) {
  console.error("❌ Cloudinary storage setup error:", error);
  // Fallback to memory storage if Cloudinary fails
  storage = multer.memoryStorage();
  console.log("🔄 Fallback to memory storage");
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  timeout: 300000, // 5 minutes timeout
});

export default upload;
