import express from "express";
import {
  commentOnPost,
  deleteComment,
  deletePost,
  editCaption,
  getAllPost,
  likeUnlikePost,
  newPost,
} from "../controllers/postControllers.js";
import isAuth from "../middleware/isAuth.js";
import { uploadFile } from "../middleware/multer.js";

const router = express.Router();

router.post("/new", isAuth, uploadFile.single("file"), newPost);
router.delete("/:id", isAuth, deletePost);
router.put("/:id", isAuth, editCaption);
router.get("/all", isAuth, getAllPost);
router.post("/like/:id", isAuth, likeUnlikePost);
router.post("/comment/:id", isAuth, commentOnPost);
router.delete("/comment/:id", isAuth, deleteComment);

export default router;
