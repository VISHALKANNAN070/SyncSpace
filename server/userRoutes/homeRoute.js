import express from "express";
import axios from "axios";
import verifyToken from "../middleware/verifyToken.js";
import User from "../models/user.model.js";
const router = express.Router();

// Protected route to get user info and GitHub repos
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const username = user.username;
    const email = user.email;
    const githubToken = user.accessToken;

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${githubToken}` },
    });

    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    return res.status(200).json({ username, email, repos: response.data });
  } catch (err) {
    console.error(err);
    return res.json({ message: "Failed to fetch repos" });
  }
});
export default router;
