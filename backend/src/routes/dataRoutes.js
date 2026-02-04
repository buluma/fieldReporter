import express from "express";
const router = express.Router();
import { syncData } from "../controllers/dataController.js";
import { protect } from "../middleware/auth.js";

router.route("/sync").post(protect, syncData);

export default router;
