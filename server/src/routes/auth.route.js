import express from "express";
import {
  OAuthLogin,
  OAuthCallback,
  logout,
  deleteAccount
} from "../controllers/auth.controller.js";
import { validateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/github", OAuthLogin);
router.get("/github/callback", OAuthCallback);
router.get("/logout", logout);
router.delete("/delete-account",validateToken,deleteAccount)

export default router;
