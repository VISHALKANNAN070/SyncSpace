import express from "express";
import verifyToken from "../middleware/auth.js";
import {
  getRepos,
  selectRepos,
  getSelectedRepos,
} from "../controllers/repo.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send(
    `<h1 style="color:black;text-align:center;margin-top:50px;font-family:Arial;">Server is running 🚀</h1>`
  );
});

router.get("/repos", verifyToken, getRepos);
router.post("/repos/select", verifyToken, selectRepos);
router.get("/repos/selected", verifyToken, getSelectedRepos);

export default router;
