import { authenticate } from "../Middleware/AuthMiddleware.js";
import express from "express";
import {
  ForgotPassword,
  onBoarding,
  Login,
  Logout,
  SignUp,
  GetOTP,
  VerifyOtp,
} from "../Controllers/Auth/Auth.js";

const router = express.Router();

router.get("/me", authenticate, (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
});
router.post("/onBoarding", authenticate, onBoarding);
router.post("/forgot-password", ForgotPassword);
router.post("/verify-otp", VerifyOtp);
router.post("/get-otp", GetOTP);
router.post("/logout", Logout);
router.post("/signup", SignUp);
router.post("/login", Login);

export default router;
