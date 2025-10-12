import express from "express";
import passport from "passport";
import verifyToken from "../middleware/auth.js";
import {
  githubAuth,
  githubCallback,
  logout,
  getProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);
router.get("/logout", logout);
router.get("/profile", verifyToken, getProfile);

export default router;
