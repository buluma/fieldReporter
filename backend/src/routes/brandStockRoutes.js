import express from "express";
const router = express.Router();
import {
  getBrandStocks,
  getBrandStock,
  createBrandStock,
  updateBrandStock,
  deleteBrandStock,
} from "../controllers/brandStockController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getBrandStocks).post(protect, createBrandStock);
router
  .route("/:id")
  .get(protect, getBrandStock)
  .put(protect, updateBrandStock)
  .delete(protect, authorize("team-leader"), deleteBrandStock);

export default router;
