import { dbonnect } from "./Src/Database/dbConnect.js";
import authRoutes from "./Src/Routes/authRoutes.js";
import userRoutes from "./Src/Routes/userRoutes.js";
import chatRoutes from "./Src/Routes/chatRoutes.js";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT;
const app = express();

const corsOption = {
  methods: "GET, POST, PUT, DELETE",
  origin: "http://localhost:5173",
  optionsSuccessStatus: 204,
  preflightContinue: false,
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server Lisiten on Port ${PORT}`);
  dbonnect();
});
