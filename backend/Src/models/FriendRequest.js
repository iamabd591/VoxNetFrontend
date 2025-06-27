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
    enum: ["accepted", "pending", "rejected"],
    default: "pending",
    type: string,
  },
  { timestamps: true }
);

const FriendRequest = mongoose.modal("FriendRequest", request);
export default FriendRequest;
