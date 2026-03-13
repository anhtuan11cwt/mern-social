import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { configureCloudinary } from "./config/cloudinary.js";
import { connectDb } from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();
configureCloudinary();

const PORT = process.env.PORT || 7000;

connectDb();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (_req, res) => {
  res.send("Máy chủ đang hoạt động");
});

server.listen(PORT, () => {
  console.log(`Máy chủ đang chạy trên cổng ${PORT}`);
});
