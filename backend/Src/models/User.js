import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      required: true,
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    age: {
      type: Number,
    },
    email: {
      required: true,
      unique: true,
      type: String,
    },
    password: {
      required: true,
      minLength: 8,
      type: String,
    },
    profileUrl: {
      type: String,
    },
    location: {
      type: String,
    },
    language: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    isOnBoarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
