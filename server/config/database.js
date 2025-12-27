import mongoose from "mongoose";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected Succesfully");
  } catch (error) {
    console.error("There was an error connecting MongoDB");
  }
};
export default connectDB;