import express from "express";
const router = express.Router();
import {
  getActivations,
  getActivation,
  createActivation,
  updateActivation,
  deleteActivation,
} from "../controllers/activationController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getActivations).post(protect, createActivation);
router
  .route("/:id")
  .get(protect, getActivation)
  .put(protect, updateActivation)
  .delete(protect, authorize("team-leader"), deleteActivation);

export default router;
