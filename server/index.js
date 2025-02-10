import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express(); // Move this line to the top

// Configure CORS
app.use(
  cors({
    origin:
      process.env.APPLICATION_URL ||
      "https://memories-project-client.vercel.app", // Use environment variable if available
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log(
  "CORS allowed origin:",
  process.env.APPLICATION_URL || "https://memories-project-client.vercel.app"
);

// Middleware for handling incoming JSON data
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Routes
app.use("/posts", postRoutes);
app.use("/user", userRoutes);

// Add a root route
app.get("/", (req, res) => {
  res.send("Memories Project API is running");
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
