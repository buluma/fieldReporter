import express from "express";
const router = express.Router();
import {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
} from "../controllers/storeController.js";
import { protect, authorize } from "../middleware/auth.js";

router.route("/").get(protect, getStores).post(protect, createStore);
router
  .route("/:id")
  .get(protect, getStore)
  .put(protect, updateStore)
  .delete(protect, deleteStore);

export default router;
