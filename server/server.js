import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "dotenv/config.js";

import connectDB from "./config/db.js";
import "./auth/passport.js";
import authRoutes from "./routes/auth.routes.js";
import repoRoutes from "./routes/repo.routes.js";

const app = express();

app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// Connect database
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/", repoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
