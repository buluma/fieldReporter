import prisma from "../../config/prismaClient.js";

// @desc    Get all login logs
// @route   GET /api/login-logs
// @access  Private/Admin
const getLoginLogs = async (req, res) => {
  try {
    const loginLogs = await prisma.loginLog.findMany({
      orderBy: { timestamp: "desc" },
    });
    res.status(200).json(loginLogs);
  } catch (error) {
    console.error("Error fetching login logs:", error);
    res.status(500).json({ message: "Failed to fetch login logs" });
  }
};

export { getLoginLogs };
