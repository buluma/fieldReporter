import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import prisma from "./config/prismaClient.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

import authRoutes from "./src/routes/authRoutes.js";

import storeRoutes from "./src/routes/storeRoutes.js";

import userRoutes from "./src/routes/userRoutes.js";

import dataRoutes from "./src/routes/dataRoutes.js";

import rateLimit from "express-rate-limit";



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



// Mount store routes

app.use("/api/stores", storeRoutes);

// Mount user routes

app.use("/api/users", userRoutes);

// Mount data routes

app.use("/api/data", dataRoutes);



app.get("/health", (req, res) => {

  res.json({ status: "ok" });

});



app.listen(PORT, async () => {

  console.log(`Field Reporter backend listening on port ${PORT}`);

});
