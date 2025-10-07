import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config"
import axios from "axios";
import cookieParser from "cookie-parser";
import verifyToken from "./middleware/auth.js";
import Repo from "./models/repo.js";

const app = express();

app.use(cookieParser());
app.use(cors({ origin: `${process.env.FRONTEND_URL}`, credentials: true }));
app.use(express.json());

import passport from "passport";
import "./auth/passport.js";
app.use(passport.initialize());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error =>", err.message);
    process.exit(1);
  }
};

connectDB();

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

const isProduction = process.env.NODE_ENV === "production";

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        username: req.user.username,
        name: req.user.name,
        avatarURL: req.user.avatarURL,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    fetchRepos(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

app.post("/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction, 
    sameSite: isProduction ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

app.get("/profile", verifyToken, (req, res) => {
  res.json({
    username: req.user.username,
    email: req.user.email,
    name: req.user.name,
    avatarURL: req.user.avatarURL,
  });
});

export default async function fetchRepos(user) {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${user.username}/repos`
    );

    const repos = response.data.map((repo) => ({
      user: user._id,
      name: repo.name,
    }));

    for (let r of repos) {
      await Repo.updateOne(
        { user: r.user, name: r.name },
        { $set: r },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
}

app.get("/repos", verifyToken, async (req, res) => {
  try {
    const repos = await Repo.find({ user: req.user.id });
    res.json(repos);
  } catch (err) {
    console.error("Error fetching repos from DB:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send(`
      <h1 style="color: black; text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
        Server is running 🚀
      </h1>
    `);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
