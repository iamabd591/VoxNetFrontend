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
