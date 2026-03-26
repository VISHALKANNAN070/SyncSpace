import express from "express";
import axios from "axios";
import verifyToken from "../middleware/verifyToken.js";
import Note from "../models/note.model.js";

const router = express.Router();

//create note for a repo
router.post("/:repoId", verifyToken, async (req, res) => {
  try {
    const { repoId } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id;
    const note = await Note.create({ userId, repoId, title, content });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get notes for a repo
router.get("/:repoId", verifyToken, async (req, res) => {
  try {
    const { repoId } = req.params;
    const userId = req.user._id;
    const note = await Note.find({ userId, repoId: String(repoId) });
    res.status(200).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//delete note
router.delete("/:_id", verifyToken, async (req, res) => {
  try {
    const { _id } = req.params;
    const userId = req.user._id;
    await Note.findOneAndDelete({ userId, _id });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
