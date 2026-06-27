import passport from "passport";
import { generateToken, generateCookie } from "../middlewares/auth.middleware.js";

export const OAuthLogin = passport.authenticate("github", {
  session: false,
  scope: ["user:email"],
});

export const OAuthCallback = (req, res, next) => {
  passport.authenticate("github", { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
      return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=no_user`);
    }

    const token = generateToken(user._id);

    res.cookie("token", token, generateCookie());

    return res.json({
      success: true,
      user,
    });  })(req, res, next);
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

export const deleteAccount = async(req,res) => {
  const userId = req.user._id
  
}