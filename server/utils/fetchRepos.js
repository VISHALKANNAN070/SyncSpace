import axios from "axios";
import Repo from "../models/repo.js";

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
      console.log(`Synced ${repos.length} repos for ${user.username}`);
  } catch (error) {
    console.error("Error fetching repos:", error.message);
    return [];
  }
}
