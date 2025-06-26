import { generateAndSetToken, otpCache } from "../../utils/utils.js";
import { upsertSteamUser } from "../../client/Stream.js";
import User from "../../models/User.js";
import bcrypt from "bcrypt";

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
    const avtarEndpoint = gender === "male" ? "boy" : "girl";
    const profilePic = `https://avatar.iran.liara.run/public/${avtarEndpoint}`;

    const newUser = new User({
      password: hashedPassword,
      profileUrl: profilePic,
      fullName,
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
    res.status(201).json({
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
    const isMatched = await bcrypt.compare(password, User.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const token = generateAndSetToken(res, User._id);
    console.table([{ UserName: User.fullName, token }]);
    const { password: _, ...userWithoutPassword } = User.toObject();
    res.status(201).json({
      message: "Login successfully",
      user: { user: userWithoutPassword },
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const getOTP = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "Missing Credentials" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    //TODO Send otp to email
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const VerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Missing Credentials" });
  }
  try {
    const otpData = otpCache.get(email);
    if (otpData) {
      return res.status(400).json({ message: "Someting went wrong" });
    }
    if (otpData.otp != otp) {
      return res.status(400).json({ message: "Invalid Otp" });
    }
    otpCache.delete(email);
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const ForgotPassword = async (req, res) => {
  const { email, newpassword } = req.body;
  if (!email || !newpassword) {
    return res.status(400).json({ message: "Missing Credentials" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const hashedNewPassword = await bcrypt.hash(newpassword, 10);
    await User.findOneAndUpdate(
      { email },
      { password: hashedNewPassword },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const Logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successfully" });
};
