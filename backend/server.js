import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import prisma from "./config/prismaClient.js";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

// Route imports
import authRoutes from "./src/routes/authRoutes.js";
import storeRoutes from "./src/routes/storeRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import dataRoutes from "./src/routes/dataRoutes.js";
import loginLogRoutes from "./src/routes/loginLogRoutes.js";
import checkinRoutes from "./src/routes/checkinRoutes.js";
import brandRoutes from "./src/routes/brandRoutes.js";
import brandStockRoutes from "./src/routes/brandStockRoutes.js";
import availabilityRoutes from "./src/routes/availabilityRoutes.js";
import placementRoutes from "./src/routes/placementRoutes.js";
import activationRoutes from "./src/routes/activationRoutes.js";
import visibilityRoutes from "./src/routes/visibilityRoutes.js";
import tlFocusRoutes from "./src/routes/tlFocusRoutes.js";
import tlObjectiveRoutes from "./src/routes/tlObjectiveRoutes.js";
import objectiveRoutes from "./src/routes/objectiveRoutes.js";
import otherObjectiveRoutes from "./src/routes/otherObjectiveRoutes.js";
import listingRoutes from "./src/routes/listingRoutes.js";
import performanceRoutes from "./src/routes/performanceRoutes.js";
import checklistRoutes from "./src/routes/checklistRoutes.js";
import dailyPlannerRoutes from "./src/routes/dailyPlannerRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(express.static(publicDir));

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many login attempts from this IP, please try again after 15 minutes",
});
app.use("/api/auth", authLimiter, authRoutes);

// Mount core routes
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/data", dataRoutes);

// Mount specific feature routes
app.use("/api/login-logs", loginLogRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/brand-stocks", brandStockRoutes);
app.use("/api/availabilities", availabilityRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/activations", activationRoutes);
app.use("/api/visibilities", visibilityRoutes);
app.use("/api/tl-focuses", tlFocusRoutes);
app.use("/api/tl-objectives", tlObjectiveRoutes);
app.use("/api/objectives", objectiveRoutes);
app.use("/api/other-objectives", otherObjectiveRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/performances", performanceRoutes);
app.use("/api/checklists", checklistRoutes);
app.use("/api/daily-planners", dailyPlannerRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});



app.listen(PORT, async () => {

  console.log(`Field Reporter backend listening on port ${PORT}`);

});
