import express from "express";
import {
  getAllChats,
  getAllMessages,
  sendMessage,
} from "../controllers/messageControllers.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/", isAuth, sendMessage);
router.get("/chat", isAuth, getAllChats);
router.get("/:id", isAuth, getAllMessages);

export default router;
