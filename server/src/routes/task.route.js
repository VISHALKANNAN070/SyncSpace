import express from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getAllTasks } from "../controllers/task.controller.js";
const router = express.Router();

router.post("/:repoId", validateToken, createTask);

router.get("/:repoId", validateToken, getAllTasks);

router.patch("/:repoId/:_id", validateToken, );

router.delete("/:repoId/:id", validateToken, deleteTask);

export default router;
