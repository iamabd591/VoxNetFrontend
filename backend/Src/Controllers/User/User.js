import FriendRequest from "../../Models/FriendRequest.js";
import User from "../../Models/User.js";

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
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res
        .status(401)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    const recipientUser = await User.findById(recipientId);
    if (!recipientUser) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipientUser.friends.includes(myId)) {
      return res
        .status(401)
        .json({ message: "You are already friends with this user" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const requestSent = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
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

    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
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

    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
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
    const incomingRequests = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate("sender", "fullName profileUrl location");

    const acceptedSentRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted",
    }).populate("recipient", "fullName profileUrl");

    return res.status(200).json({
      incomingRequests: incomingRequests,
      acceptedSentRequests: acceptedSentRequests,
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
