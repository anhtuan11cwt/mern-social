import express from "express";
import {
  deletePost,
  getAllPost,
  newPost,
} from "../controllers/postControllers.js";
import isAuth from "../middleware/isAuth.js";
import { uploadFile } from "../middleware/multer.js";

const router = express.Router();

router.post("/new", isAuth, uploadFile.single("file"), newPost);
router.delete("/:id", isAuth, deletePost);
router.get("/all", isAuth, getAllPost);

export default router;
