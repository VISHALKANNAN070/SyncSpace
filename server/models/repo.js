import mongoose from "mongoose";

const repoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  selected: {
    type: Boolean,
    default: false,
  }
});

const Repo = mongoose.model("Repo", repoSchema);
export default Repo;
