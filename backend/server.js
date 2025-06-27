import { dbonnect } from "./Src/Database/dbConnect.js";
import authRoutes from "./Src/Routes/authRoutes.js";
import userRoutes from "./Src/Routes/userRoutes.js";
import chatRoutes from "./Src/Routes/chatRoutes.js";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth/api", authRoutes);
app.use("/user/api", userRoutes);
app.use("/chat/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server Lisiten on Port ${PORT}`);
  dbonnect();
});
