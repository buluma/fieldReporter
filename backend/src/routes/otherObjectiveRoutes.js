import express from "express";
const router = express.Router();
import {
  getOtherObjectives,
  getOtherObjective,
  createOtherObjective,
  updateOtherObjective,
  deleteOtherObjective,
} from "../controllers/otherObjectiveController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getOtherObjectives).post(protect, createOtherObjective);
router
  .route("/:id")
  .get(protect, getOtherObjective)
  .put(protect, updateOtherObjective)
  .delete(protect, authorize("team-leader"), deleteOtherObjective);

export default router;
