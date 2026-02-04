import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Please add all fields" });
  }

  // Check if user exists
  const userExists = await prisma.user.findUnique({
    where: { username },
  });

  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: hashedPassword,
      role: role || "field",
    },
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ error: "Invalid user data" });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Check for user username
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export { registerUser, loginUser, getMe };
