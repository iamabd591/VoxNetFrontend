import { authenticate } from "../Middleware/AuthMiddleware.js";
import express from "express";
import {
  ForgotPassword,
  onBoarding,
  Login,
  Logout,
  SignUp,
} from "../Controllers/Auth/Auth.js";

const router = express.Router();

router.get("/me", authenticate, (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
});
router.post("/onBoarding", authenticate, onBoarding);
router.post("/forgot-password", ForgotPassword);
router.post("/signup", SignUp);
router.post("/logout", Logout);
router.post("/login", Login);

export default router;
