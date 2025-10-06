import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import passport from "./auth/passport.js";
import cookieParser from "cookie-parser";
import verifyToken from "./middleware/auth.js";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(cors({ origin: `${process.env.FRONTEND_URL}`, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error =>", err.message);
    process.exit(1);
  }
};
connectDB();

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, name: req.user.name, avatarURL: req.user.avatarURL },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

app.post("/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

app.get("/profile", verifyToken, (req, res) => {
  res.json({ name: req.user.name, avatarURL: req.user.avatarURL });
});

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
