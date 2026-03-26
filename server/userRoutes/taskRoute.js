import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import Task from "../models/task.model.js";

const router = express.Router();

router.post("/:repoId", verifyToken, async (req, res) => {
  const { repoId } = req.params;
  const { text } = req.body;

  const todo = await Task.create({
    userId: req.user._id,
    repoId,
    text,
  });
  res.json(todo);
});

router.get("/:repoId", verifyToken, async (req, res) => {
  const todos = await Task.find({
    userId: req.user._id,
    repoId: req.params.repoId,
  });
  res.json(todos);
});

router.patch("/:id", verifyToken, async (req, res) => {
  const todo = await Task.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});
router.delete("/:id", verifyToken, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
