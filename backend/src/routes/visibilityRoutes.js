import express from "express";
const router = express.Router();
import {
  getVisibilities,
  getVisibility,
  createVisibility,
  updateVisibility,
  deleteVisibility,
} from "../controllers/visibilityController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getVisibilities).post(protect, createVisibility);
router
  .route("/:id")
  .get(protect, getVisibility)
  .put(protect, updateVisibility)
  .delete(protect, authorize("team-leader"), deleteVisibility);

export default router;
