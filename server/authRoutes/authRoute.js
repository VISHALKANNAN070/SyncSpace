import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();
const isProd = process.env.NODE_ENV === "production";

// GitHub OAuth login route
router.get(
  "/github",
  passport.authenticate("github", { session: false, scope: ["user:email"] }),
);

// GitHub OAuth callback route
router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
      return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=no_user`);
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set httpOnly cookie — NOT exposed in URL (security fix)
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend WITHOUT token in the URL
    return res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
  })(req, res, next);
});

// Retained for potential direct token exchange use cases
router.post("/set-cookie", (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "OK" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.status(200).json({ message: "Logout successful" });
});

export default router;
