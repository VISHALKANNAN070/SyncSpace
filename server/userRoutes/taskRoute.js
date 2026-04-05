import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import Task from "../models/task.model.js";

const router = express.Router();

router.post("/:repoId", verifyToken, async (req, res) => {
  try {
    const { repoId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Task text is required" });
    }

    const todo = await Task.create({
      userId: req.user._id,
      repoId,
      text: text.trim(),
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:repoId", verifyToken, async (req, res) => {
  try {
    const todos = await Task.find({
      userId: req.user._id,
      repoId: req.params.repoId,
    });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const todo = await Task.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Task not found" });
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
