import express from "express";
const router = express.Router();
import {
  getChecklists,
  getChecklist,
  createChecklist,
  updateChecklist,
  deleteChecklist,
} from "../controllers/checklistController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getChecklists).post(protect, createChecklist);
router
  .route("/:id")
  .get(protect, getChecklist)
  .put(protect, updateChecklist)
  .delete(protect, authorize("team-leader"), deleteChecklist);

export default router;
