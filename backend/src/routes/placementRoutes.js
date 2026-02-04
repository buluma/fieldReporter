import express from "express";
const router = express.Router();
import {
  getPlacements,
  getPlacement,
  createPlacement,
  updatePlacement,
  deletePlacement,
} from "../controllers/placementController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getPlacements).post(protect, createPlacement);
router
  .route("/:id")
  .get(protect, getPlacement)
  .put(protect, updatePlacement)
  .delete(protect, authorize("team-leader"), deletePlacement);

export default router;
