import { femaleNumbers, maleNumbers } from "../../utils/constant.js";
import { upsertSteamUser } from "../../client/Stream.js";
import User from "../../Models/User.js";
import bcrypt from "bcrypt";
import {
  generateAndSetToken,
  sendOtpToEmail,
  verifiedOtps,
  otpCache,
  saveOTP,
} from "../../utils/utils.js";

export const SignUp = async (req, res) => {
  const { email, fullName, password, gender } = req.body;

  if (!email || !fullName || !password || !gender) {
    return res.status(400).json({ message: "Missing Credentials" });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!["male", "female"].includes(gender)) {
      return res
        .status(400)
        .json({ message: "Gender must be 'male' or 'female'" });
    }
    const randomNumber =
      gender === "male"
        ? maleNumbers[Math.floor(Math.random() * maleNumbers.length)]
        : femaleNumbers[Math.floor(Math.random() * femaleNumbers.length)];

    const profilePic = `https://avatar.iran.liara.run/public/${randomNumber}`;

    const newUser = new User({
      password: hashedPassword,
      profileUrl: profilePic,
      fullName,
      gender,
      email,
    });
    await newUser.save();
    await upsertSteamUser({
      id: newUser._id,
      name: newUser.fullName,
      image: newUser.profileUrl,
    });
    console.log("✅ Stream User created");
    const token = generateAndSetToken(res, newUser._id);
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    console.table([{ UserName: newUser.fullName, token }]);
    return res.status(201).json({
      message: "User sign up successfully",
      user: { user: userWithoutPassword },
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing Credentials" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    console.log(isMatched);
    if (!isMatched) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const token = generateAndSetToken(res, user._id);
    console.table([{ UserName: user.fullName, token }]);
    const { password: _, ...userWithoutPassword } = user.toObject();
    return res.status(201).json({
      message: "Login successfully",
      user: { user: userWithoutPassword },
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const GetOTP = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    return res.status(400).json({ message: "Missing Credentials" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = saveOTP(email);

    if (!otp) {
      return res.status(429).json({
        message:
          "An OTP was already sent. Please wait before requesting again.",
      });
    }

    const isSend = await sendOtpToEmail(email, otp);
    if (isSend) {
      return res.status(200).json({ message: `OTP sent to email ${email}` });
    } else {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const VerifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Required Fields Are Missing" });
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ error: "User Not Found" });
  }

  try {
    const otpData = otpCache.get(email);
    if (!otpData) {
      return res.status(404).json({ error: "OTP Not Found" });
    }

    if (otpData.otp === otp) {
      otpCache.delete(email);
      verifiedOtps.set(email, true);
      return res.status(200).json({ message: "OTP Verified Successfully" });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

export const ForgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Missing Credentials" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    const isVerified = verifiedOtps.get(email);
    if (!isVerified) {
      return res.status(403).json({ message: "OTP not verified" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email },
      { password: hashedNewPassword },
      { new: true, runValidators: true }
    );

    verifiedOtps.delete(email);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const Logout = (req, res) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res
      .status(400)
      .json({ message: "No active session or token found" });
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Logout successfully" });
};

export const onBoarding = async (req, res) => {
  const { location, age, language, bio } = req.body;
  if (!location || !age || !language || !bio) {
    return res.status(400).json({ message: "Missing Credentials" });
  }
  try {
    await User.findOneAndUpdate(
      req.user._id,
      { ...req.body, isOnBoarded: true },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json({ message: "User Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { fullName, bio, location, age, language, gender } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let newProfileUrl = user.profileUrl;
    if (gender !== user.gender) {
      const avatarNumber =
        gender === "male"
          ? maleNumbers[Math.floor(Math.random() * maleNumbers.length)]
          : femaleNumbers[Math.floor(Math.random() * femaleNumbers.length)];

      newProfileUrl = `https://avatar.iran.liara.run/public/${avatarNumber}`;
    }

    user.profileUrl = newProfileUrl;
    user.fullName = fullName;
    user.location = location;
    user.language = language;
    user.gender = gender;
    user.bio = bio;
    user.age = age;

    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
