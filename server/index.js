import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://memories-project-client.vercel.app", // Update to match the client URL
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

console.log("CORS allowed origin:", process.env.APPLICATION_URL);

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/posts", postRoutes);
app.use("/user", userRoutes);
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
