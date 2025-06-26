import { friendUsers, recomendedUsers } from "../Controllers/User/User.js";
import { authenticate } from "../Middleware/AuthMiddleware.js";
import express from "express";

const router = express.Router();
router.use(authenticate);

router.get("/recomended", recomendedUsers);
router.get("/friends", friendUsers);
