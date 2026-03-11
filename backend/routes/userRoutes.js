import express from "express";
import {
  followAndUnFollowUser,
  myProfile,
  updatePassword,
  updateProfile,
  userFollowerAndFollowingData,
  userProfile,
} from "../controllers/userController.js";
import isAuth from "../middleware/isAuth.js";
import { uploadFile } from "../middleware/multer.js";

const router = express.Router();

router.get("/me", isAuth, myProfile);
router.get("/followdata/:id", isAuth, userFollowerAndFollowingData);
router.get("/:id", isAuth, userProfile);
router.post("/follow/:id", isAuth, followAndUnFollowUser);
router.put("/:id", isAuth, uploadFile.single("file"), updateProfile);
router.post("/update-password", isAuth, updatePassword);

export default router;
