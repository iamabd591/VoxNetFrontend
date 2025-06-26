import { dbonnect } from "./Src/Database/dbConnect.js";
import authRoutes from "./Src/Routes/authRoutes.js";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth/api", authRoutes );

app.listen(PORT, () => {
  console.log(`Server Lisiten on Port ${PORT}`);
  dbonnect();
});
