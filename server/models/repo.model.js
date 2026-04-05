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

// Prevent duplicate repos per user (guards against race conditions)
repoSchema.index({ userId: 1, repoId: 1 }, { unique: true });

const Repo = mongoose.model("Repo", repoSchema);
export default Repo;
