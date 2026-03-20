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
      // Redirect to frontend with error
      return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=no_user`);
    }

    const token = jwt.sign(
      {
        _id: user._id,
        githubId: user.githubId,
        username: user.username,
        email: user.email,
        accessToken: user.accessToken,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    // Redirect to FRONTEND, not backend
    return res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  res.redirect(process.env.FRONTEND_URL + "/auth/callback");
});

export default router;
