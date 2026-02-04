import express from "express";
const router = express.Router();
import {
  getTLFocuses,
  getTLFocus,
  createTLFocus,
  updateTLFocus,
  deleteTLFocus,
} from "../controllers/tlFocusController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getTLFocuses).post(protect, createTLFocus);
router
  .route("/:id")
  .get(protect, getTLFocus)
  .put(protect, updateTLFocus)
  .delete(protect, authorize("team-leader"), deleteTLFocus);

export default router;
