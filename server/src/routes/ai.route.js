import express from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import { brainstorm } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/:repoId/brainstorm", validateToken, brainstorm);

export default router