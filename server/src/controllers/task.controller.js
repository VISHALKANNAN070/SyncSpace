import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { task } = req.body;

    if (!task?.trim()) {
      return res.status(400).json({ error: "Task text is required" });
    }

    const todo = await Task.create({
      userId: req.user._id,
      repoId,
      task: task.trim(),
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const { repoId } = req.params;
    const userId = req.user._id;
    const todos = await Task.find({
      userId,
      repoId,
    });
    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const patchTask = async (req, res) => {
  try {
    const { _id, repoId } = req.params;
    const userId = req.user._id;
    const todo = await Task.findOne({_id, repoId,userId});
    if (!todo) {
      return res.status(404).json({ error: "Task not found" });
    }
    todo.completed = !todo.completed;
    await todo.save();
    return res.status(200).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { _id, repoId } = req.params;
    const userId = req.user._id;
    await Task.findOneAndDelete(_id, repoId, userId);
    res.json({ message: "Task Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
