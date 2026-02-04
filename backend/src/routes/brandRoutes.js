import express from "express";
const router = express.Router();
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getBrands).post(protect, authorize("team-leader"), createBrand);
router
  .route("/:id")
  .get(protect, getBrand)
  .put(protect, authorize("team-leader"), updateBrand)
  .delete(protect, authorize("team-leader"), deleteBrand);

export default router;
