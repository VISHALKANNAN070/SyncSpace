import express from "express";
import axios from "axios";
import verifyToken from "../middleware/verifyToken.js";
import User from "../models/user.model.js";

const router = express.Router();

// Protected route to get user info and GitHub repos
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email, accessToken: githubToken } = user;

    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
      },
      params: { per_page: 100, sort: "updated" },
    });

    return res.status(200).json({ username, email, repos: response.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch repos" });
  }
});

export default router;
