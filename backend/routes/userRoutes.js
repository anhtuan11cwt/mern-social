import express from "express";
import { myProfile, userProfile } from "../controllers/userController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/me", isAuth, myProfile);
router.get("/:id", isAuth, userProfile);

export default router;
