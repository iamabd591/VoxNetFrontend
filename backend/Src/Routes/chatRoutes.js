import { getChatStreamToken } from "../Controllers/Chat/chat.js";
import { authenticate } from "../Middleware/AuthMiddleware.js";
import express from "express";

const router = express.Router();
router.use(authenticate);

router.get("/get-stream-token", getChatStreamToken);

export default router;
