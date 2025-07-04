import FriendRequest from "../../Models/FriendRequest.js";
import User from "../../Models/User.js";
import mongoose from "mongoose";

export const recommendedUsers = async (req, res) => {
  const currentUser = req.user;
  const currentUserId = req.user._id;

  try {
    const recommended = await User.find({
      _id: { $nin: [...currentUser.friends, currentUserId] },
      isOnBoarded: true,
    }).select("-password");

    return res.status(200).json(recommended);
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const friendsUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("friends").populate({
      path: "friends",
      select: "fullName profileUrl location language",
    });

    return res.status(200).json(user.friends);
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const sentFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: recipentId } = req.params;

    if (myId.toString() === recipentId.toString()) {
      console.log(true);
      return res
        .status(401)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    const recipentUser = await User.findById(recipentId);
    if (!recipentUser) {
      return res.status(404).json({ message: "recipent not found" });
    }

    if (recipentUser.friends.includes(myId)) {
      return res
        .status(401)
        .json({ message: "You are already friends with this user" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipent: recipentId },
        { sender: recipentId, recipent: myId },
      ],
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const requestSent = await FriendRequest.create({
      sender: myId,
      recipent: recipentId,
    });

    return res.status(201).json({
      message: "Friend request sent successfully",
      request: requestSent,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipent.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipent },
    });

    await User.findByIdAndUpdate(friendRequest.recipent, {
      $addToSet: { friends: friendRequest.sender },
    });

    return res.status(200).json({
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipent.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reject this request" });
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    return res.status(200).json({
      message: "Friend request rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const allRequest = await FriendRequest.find({});
    console.log("All:", allRequest);

    const incomingRequests = await FriendRequest.find({
      recipent: new mongoose.Types.ObjectId(req.user._id),
      status: "pending",
    }).populate("sender", "fullName profileUrl location");

    const acceptedSentRequests = await FriendRequest.find({
      sender: new mongoose.Types.ObjectId(req.user._id),
      status: "accepted",
    }).populate("recipent", "fullName profileUrl");

    console.log("Incoming:", incomingRequests);

    return res.status(200).json({
      incomingRequests,
      acceptedSentRequests,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};


export const outgoingFriendRequets = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("recipent", "fullName profileUrl location");

    return res.status(200).json({ outgoingRequests });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
