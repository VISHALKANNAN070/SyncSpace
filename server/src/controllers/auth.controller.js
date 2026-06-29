import passport from "passport";
import {
  generateToken,
  generateCookie,
} from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";
import Note from "../models/note.model.js";
import Task from "../models/task.model.js";
import Repo from "../models/repo.model.js";
const isProd = process.env.NODE_ENV === "production";

export const OAuthLogin = passport.authenticate("github", {
  session: false,
  scope: ["user:email"],
});

export const OAuthCallback = (req, res, next) => {
  const handleAuth = passport.authenticate(
    "github",
    { session: false },
    (err, user) => {
      if (err) {
        console.error(err);
        return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
      }
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}?error=no_user`);
      }

      const token = generateToken(user._id);
      res.cookie("token", token, generateCookie());

      return res.redirect(`${process.env.FRONTEND_URL}`);
    },
  );
  handleAuth(req, res, next);
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.status(200).json({ message: "Logout successful" });
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    await Promise.all([
      Note.deleteMany({ userId }),
      Task.deleteMany({ userId }),
      Repo.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete account" });
  }
};
