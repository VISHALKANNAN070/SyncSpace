import express from "express";
import axios from "axios";
import verifyToken from "../middleware/verifyToken.js";
import Repo from "../models/repo.model.js";

const router = express.Router();

//Post selected repo
router.post("/", verifyToken, async (req, res) => {
  try {
    const { repoId, name, url } = req.body;
    const userId = req.user._id;
    console.log(typeof req.user._id, req.user._id);
    let repo = await Repo.findOne({ userId, repoId });

    if (!repo) {
      repo = await Repo.create({
        userId,
        repoId,
        name,
        url,
      });
    }

    res.status(200).json(repo);
  } catch (err) {
    console.error("repoRoute", err);
    res.status(500).json({ error: err.message });
  }
});

//get selected repo
router.get("/:repoId", verifyToken, async (req, res) => {
  try {
    const { repoId } = req.params;
    const userId = req.user._id;
    let repo = await Repo.findOne({ userId, repoId });
    res.status(200).json(repo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
