import dotenv from "dotenv";
import express from "express";
import { connectDb } from "./database/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

connectDb();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Máy chủ đang hoạt động");
});

app.listen(PORT, () => {
  console.log(`Máy chủ đang chạy trên cổng ${PORT}`);
});
