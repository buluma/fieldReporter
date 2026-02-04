import express from "express";
const router = express.Router();
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getListings).post(protect, createListing);
router
  .route("/:id")
  .get(protect, getListing)
  .put(protect, updateListing)
  .delete(protect, authorize("team-leader"), deleteListing);

export default router;
