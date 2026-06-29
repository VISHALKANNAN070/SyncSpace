import axios from "axios"
import User from "../models/user.model.js";

export const fetchRepos = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email, accessToken } = user;

    const getRepos = async (accessToken) => {
      const { data } = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
        params: { per_page: 100, sort: "updated" },
      });
      return data;
    };

    const repos = await getRepos(accessToken)

    return res
      .status(200)
      .json({ message: "Repos received", username, email, repos });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch repos" });
  }
};
