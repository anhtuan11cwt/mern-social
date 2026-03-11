import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authControllers.js";
import { uploadFile } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", uploadFile.single("file"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
