import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// GitHub OAuth login route
router.get(
  "/github",
  passport.authenticate("github", { session: false, scope: ["user:email"] })
);

// GitHub OAuth callback route
router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    if (!user) {
      return res.redirect("/");
    }

    const token = jwt.sign(
      {
        githubId: user._id,
        username: user.username,
        email: user.email,
        accessToken: user.accessToken,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.redirect(process.env.FRONTEND_URL+"/auth/callback");
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.redirect(process.env.FRONTEND_URL+"/auth/callback");
});

export default router;
