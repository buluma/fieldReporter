import express from "express";
const router = express.Router();
import {
  getDailyPlanners,
  getDailyPlanner,
  createDailyPlanner,
  updateDailyPlanner,
  deleteDailyPlanner,
} from "../controllers/dailyPlannerController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getDailyPlanners).post(protect, createDailyPlanner);
router
  .route("/:id")
  .get(protect, getDailyPlanner)
  .put(protect, updateDailyPlanner)
  .delete(protect, authorize("team-leader"), deleteDailyPlanner);

export default router;
