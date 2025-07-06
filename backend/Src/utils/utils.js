import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const otpCache = new Map();
export const verifiedOtps = new Map();

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: process.env.MAILER_SECURE,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

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
  const existing = otpCache.get(email);
  const now = Date.now();

  if (existing && existing.expiry > now) {
    return null;
  }

  const otp = generateOTP();
  const expiry = now + 10 * 60 * 1000;
  otpCache.set(email, { otp, expiry });
  return otp;
};

export const sendOtpToEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.MAILER_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px; border-radius: 10px; border: 1px solid #e5e7eb;">
          <h2 style="text-align: center; color: #4f46e5;">🔐 Your OTP Code</h2>
          <p style="font-size: 16px; color: #374151;">Hello,</p>
          <p style="font-size: 16px; color: #374151;">
            Use the code below to verify your email address. This code will expire in <strong>10 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 14px 28px; font-size: 24px; font-weight: bold; letter-spacing: 2px; background-color: #4f46e5; color: #ffffff; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            If you did not request this code, you can safely ignore this email.
          </p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            © ${new Date().getFullYear()} VoxNet — All rights reserved.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
