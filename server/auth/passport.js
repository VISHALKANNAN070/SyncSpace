import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv"
import User from "../models/User.js";

dotenv.config();

passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => { 
        try {
            const email = profile.emails?.[0]?.value;
            const name = profile.displayName || profile.username;
            if (!email) {
                return done(new Error("No email found from Github"),null)
            }
            let user = await User.findOne({ email });
            if (!user) {
                user = new User({ name, email });
                await user.save();
            } else if (user.name !== name) {
                user.name = name;
                await user.save()
            }
                return done(null, user);
        }
        catch (error) {
        return done(error, null);
    }
    }
      
))

export default passport