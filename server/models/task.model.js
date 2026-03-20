import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    repoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repo",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
