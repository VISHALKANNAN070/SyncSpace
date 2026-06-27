import express from "express";
import {validateToken} from "../middlewares/auth.middleware.js";
import { fetchRepos } from "../controllers/home.controller.js";

const router = express.Router();

router.get("/", validateToken, fetchRepos);

export default router;
