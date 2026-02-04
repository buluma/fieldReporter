import express from "express";
const router = express.Router();
import {
  getTLObjectives,
  getTLObjective,
  createTLObjective,
  updateTLObjective,
  deleteTLObjective,
} from "../controllers/tlObjectiveController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getTLObjectives).post(protect, createTLObjective);
router
  .route("/:id")
  .get(protect, getTLObjective)
  .put(protect, updateTLObjective)
  .delete(protect, authorize("team-leader"), deleteTLObjective);

export default router;
