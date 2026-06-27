import express from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import { createRepo, getRepo } from "../controllers/repo.controller.js";
const router = express.Router();

router.post("/", validateToken, createRepo);
router.get("/:repoId", validateToken, getRepo);

export default router;
