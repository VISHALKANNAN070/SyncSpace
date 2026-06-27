import express from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

const router = express.Router();

router.post("/:repoId", validateToken, createNote);
router.get("/:repoId", validateToken, getAllNotes);
router.put("/:repoId/:_id", validateToken, updateNote);
router.delete("/:repoId/:_id", validateToken, deleteNote);

export default router;
