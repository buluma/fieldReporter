import express from "express";
const router = express.Router();
import { getLoginLogs } from "../controllers/loginLogController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, authorize("team-leader"), getLoginLogs);

export default router;
