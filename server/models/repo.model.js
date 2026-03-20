import mongoose from "mongoose";

const repoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    repoId: {
      type: String,
      required: true,
    },
    name: String,
    url: String,
  },
  { timestamps: true },
);

const Repo = mongoose.model("Repo", repoSchema);
export default Repo;
