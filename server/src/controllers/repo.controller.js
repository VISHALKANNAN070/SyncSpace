import Repo from "../models/repo.model.js";

export const createRepo = async (req, res) => {
  try {
    const { repoId, name, url } = req.body;
    const userId = req.user._id;
    let repo = await Repo.findOne({ userId, repoId });

    if (!repo) {
      repo = await Repo.create({ userId, repoId, name, url });
    }

    res.status(200).json(repo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRepo = async (req, res) => {
  try {
    const { repoId } = req.params;
    const userId = req.user._id;
    const repo = await Repo.findOne({ userId, repoId });
    res.status(200).json(repo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
