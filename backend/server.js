import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

const PORT = process.env.PORT || 4000;
const DEFAULT_USERNAME = process.env.SEED_ADMIN_USERNAME || "admin";
const DEFAULT_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(express.static(publicDir));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.json({ users });
});

app.post("/auth/register", async (req, res) => {
  const { username, password, role } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return res.status(409).json({ error: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: hashedPassword,
      role: role || "field",
    },
  });

  return res.status(201).json({
    id: user.id,
    username: user.username,
    role: user.role,
  });
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.json({
    user: { id: user.id, username: user.username, role: user.role },
  });
});

app.get("/me", async (req, res) => {
  const username = req.headers["x-username"];
  if (!username) {
    return res
      .status(400)
      .json({ error: "Provide x-username header for lookup" });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({ id: user.id, username: user.username, role: user.role });
});

const ensureDefaultUser = async () => {
  const existing = await prisma.user.findUnique({
    where: { username: DEFAULT_USERNAME },
  });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  await prisma.user.create({
    data: {
      username: DEFAULT_USERNAME,
      passwordHash,
      role: "team-leader",
    },
  });
};

app.listen(PORT, async () => {
  await ensureDefaultUser();
  console.log(`Field Reporter backend listening on port ${PORT}`);
});
