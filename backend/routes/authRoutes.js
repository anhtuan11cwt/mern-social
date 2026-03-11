import express from "express";
import { registerUser } from "../controllers/authControllers.js";
import { uploadFile } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", uploadFile.single("file"), registerUser);

export default router;
