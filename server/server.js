import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv"
import passport from "./auth/passport.js";
import cookieParser from "cookie-parser";
import verifyToken from "./middleware/auth.js";



dotenv.config();
const app = express();

app.use(cookieParser());
app.use(cors({ origin: "https://sync-space-zeta.vercel.app/",credentials: true }));
app.use(express.json());
app.use(passport.initialize());

app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }))

app.get("/auth/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.redirect(`https://sync-space-zeta.vercel.app/home`);
  })

  app.get("/profile",verifyToken,(req,res)=>{res.json({username:req.user.username})})
app.get("/", (req, res) => {
  res.send(`
      <h1 style="color: black; text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
        Server is running 🚀
      </h1>
    `);
});
  

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
