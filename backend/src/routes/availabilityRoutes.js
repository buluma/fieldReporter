import express from "express";
const router = express.Router();
import {
  getAvailabilities,
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../controllers/availabilityController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getAvailabilities).post(protect, createAvailability);
router
  .route("/:id")
  .get(protect, getAvailability)
  .put(protect, updateAvailability)
  .delete(protect, authorize("team-leader"), deleteAvailability);

export default router;
