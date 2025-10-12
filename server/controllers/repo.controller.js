import Repo from "../models/repo.js";

export const getRepos = async (req, res) => {
  try {
    const repos = await Repo.find({ user: req.user.id });
    res.json(repos);
  } catch (err) {
    console.error("Error fetching repos:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const selectRepos = async (req, res) => {
  const { selectedrepos } = req.body;
  try {
    await Repo.updateMany(
      { _id: { $in: selectedrepos }, user: req.user.id },
      { selected: true }
    );
    res.json({ message: "Selected repos updated" });
  } catch (err) {
    console.error("Error updating selected repos:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSelectedRepos = async (req, res) => {
  try {
    const selected = await Repo.find({ user: req.user.id, selected: true });
    res.json(selected);
  } catch (err) {
    console.error("Error fetching selected repos:", err);
    res.status(500).json({ message: "Server error" });
  }
};
