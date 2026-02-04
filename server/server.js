import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";
import loginRoutes from "./authRoutes/authRoute.js";
import homeRoutes from "./homeRoutes/homeRoute.js";

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
app.use("/auth", loginRoutes);
app.use("/home", homeRoutes);

// Health check
app.get("/", (req, res) => {
  res.send(`Server is running on PORT ${PORT}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
