import { authenticate } from "../Middleware/AuthMiddleware.js";
import express from "express";
import {
  outgoingFriendRequets,
  rejectFriendRequest,
  acceptFriendRequest,
  sentFriendRequest,
  getFriendRequests,
  recommendedUsers,
  friendsUsers,
} from "../Controllers/User/User.js";

const router = express.Router();

router.use(authenticate);

router.delete("/reject-friend-request/:id", rejectFriendRequest);
router.put("/accept-friend-request/:id", acceptFriendRequest);
router.get("/outgoing-friend-requets", outgoingFriendRequets);
router.post("/friend-request/:id", sentFriendRequest);
router.get("/get-friend-requets", getFriendRequests);
router.get("/recomended", recommendedUsers);
router.get("/friends", friendsUsers);
