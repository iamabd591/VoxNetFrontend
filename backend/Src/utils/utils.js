import jwt from "jsonwebtoken";
import crypto from "crypto";

export const otpCache = new Map();

export const generateAndSetToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    httpOnly: true,
  });

  return token;
};

const generateOTP = () => crypto.randomInt(10000, 99999).toString();

export const saveOTP = (email) => {
  const otp = generateOTP();
  const expiry = Date.now() + 10 * 60;
  otpCache.set(email, { otp, expiry });
  return otp;
};
