import mongoose, { mongo, Schema } from "mongoose";

const request = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    recipent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["accepted", "pending", "rejected"],
    },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model("FriendRequest", request);
export default FriendRequest;
