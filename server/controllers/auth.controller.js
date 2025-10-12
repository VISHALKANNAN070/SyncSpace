import jwt from "jsonwebtoken";
import passport from "passport";
import fetchRepos from "../utils/fetchRepos.js";

const isProduction = process.env.NODE_ENV === "production";

export const githubAuth = passport.authenticate("github", {
  scope: ["user:email"],
});

export const githubCallback = [
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  async (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        username: req.user.username,
        name: req.user.name,
        avatarURL: req.user.avatarURL,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await fetchRepos(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  },
];

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getProfile = (req, res) => {
  res.json({
    username: req.user.username,
    email: req.user.email,
    name: req.user.name,
    avatarURL: req.user.avatarURL,
  });
};
