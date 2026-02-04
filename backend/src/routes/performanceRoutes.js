import express from "express";
const router = express.Router();
import {
  getPerformances,
  getPerformance,
  createPerformance,
  updatePerformance,
  deletePerformance,
} from "../controllers/performanceController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getPerformances).post(protect, createPerformance);
router
  .route("/:id")
  .get(protect, getPerformance)
  .put(protect, updatePerformance)
  .delete(protect, authorize("team-leader"), deletePerformance);

export default router;
