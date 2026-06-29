import Note from "../models/note.model.js";

export const createNote = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id;
    const note = await Note.create({ userId, repoId, title, content });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const { repoId } = req.params;
    const userId = req.user._id;
    const notes = await Note.find({ userId, repoId: String(repoId) });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { _id, repoId } = req.params;
    const userId = req.user._id;
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id, repoId, userId },
      { title, content },
      { new: true },
    );
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { _id, repoId } = req.params;
    const userId = req.user._id;
    await Note.findOneAndDelete({ _id, repoId, userId });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
