import express from "express";
const router = express.Router();
import {
  getObjectives,
  getObjective,
  createObjective,
  updateObjective,
  deleteObjective,
} from "../controllers/objectiveController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getObjectives).post(protect, createObjective);
router
  .route("/:id")
  .get(protect, getObjective)
  .put(protect, updateObjective)
  .delete(protect, authorize("team-leader"), deleteObjective);

export default router;
