import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";
import loginRoute from "./authRoutes/authRoute.js";
import homeRoute from "./userRoutes/homeRoute.js";
import repoRoute from "./userRoutes/repoRoute.js";
import noteRoute from "./userRoutes/noteRoute.js";
import taskRoute from "./userRoutes/taskRoute.js"

// Load env
dotenv.config();

// Initialize app
const app = express();
const PORT = 5000;

// Passport configuration
await import("./middleware/passport.js");

//Middleware
app.set("trust proxy", 1);
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Database connection
connectDB();

// Routes
app.use("/auth", loginRoute);
app.use("/user-data", homeRoute);
app.use("/api/repo", repoRoute);
app.use("/api/note", noteRoute);
app.use("/api/task", taskRoute);

// Health check
app.get("/", (req, res) => {
  res.send(`Server is running on PORT ${PORT}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
