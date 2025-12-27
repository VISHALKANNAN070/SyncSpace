import mongoose from "mongoose"

// User schema
const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    accessToken: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User',userSchema) 
export default User
