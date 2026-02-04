import express from "express";
const router = express.Router();
import {
  getCheckins,
  getCheckin,
  createCheckin,
  updateCheckin,
  deleteCheckin,
} from "../controllers/checkinController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, authorize("team-leader"), getCheckins).post(protect, createCheckin);
router
  .route("/:id")
  .get(protect, authorize("team-leader"), getCheckin)
  .put(protect, authorize("team-leader"), updateCheckin)
  .delete(protect, authorize("team-leader"), deleteCheckin);

export default router;
