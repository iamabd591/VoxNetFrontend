import mongoose from "mongoose";

export const dbonnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Mongo db is connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
