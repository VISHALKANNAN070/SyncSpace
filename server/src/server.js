import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";
import loginRoute from "./routes/auth.route.js";
import homeRoute from "./routes/home.route.js";
import repoRoute from "./routes/repo.route.js";
import noteRoute from "./routes/note.route.js";
import taskRoute from "./routes/task.route.js";
import aiRoute from "./routes/ai.route.js"

// Load env
dotenv.config();

// Initialize app
const app = express();
const PORT = 5000;

// Passport configuration
import("./middlewares/passport.js");

//Middleware
app.set("trust proxy", 1);
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Database connection
connectDB();

// Routes
app.use("/api/auth", loginRoute);
app.use("/api/home", homeRoute);
app.use("/api/repo", repoRoute);
app.use("/api/note", noteRoute);
app.use("/api/task", taskRoute);
app.use("/api/ai",aiRoute)

// Health check
app.get("/", (req, res) => {
  res.send(`Server is running on PORT ${PORT}`);
});

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  console.log(`Server is listening on PORT ${PORT}`);
});
