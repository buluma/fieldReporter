import express from "express";
const router = express.Router();
import { getUsers } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, authorize("team-leader"), getUsers);

export default router;
