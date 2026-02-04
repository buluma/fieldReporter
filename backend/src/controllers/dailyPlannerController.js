import prisma from "../../config/prismaClient.js";

// @desc    Get all daily plans
// @route   GET /api/daily-planners
// @access  Private
const getDailyPlanners = async (req, res) => {
  try {
    const dailyPlanners = await prisma.dailyPlanner.findMany({
      orderBy: { createdOn: "desc" },
    });
    res.status(200).json(dailyPlanners);
  } catch (error) {
    console.error("Error fetching daily planners:", error);
    res.status(500).json({ message: "Failed to fetch daily planners" });
  }
};

// @desc    Get single daily plan
// @route   GET /api/daily-planners/:id
// @access  Private
const getDailyPlanner = async (req, res) => {
  try {
    const dailyPlanner = await prisma.dailyPlanner.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (dailyPlanner) {
      res.status(200).json(dailyPlanner);
    } else {
      res.status(404).json({ message: "Daily plan not found" });
    }
  } catch (error) {
    console.error("Error fetching daily plan:", error);
    res.status(500).json({ message: "Failed to fetch daily plan" });
  }
};

// @desc    Create new daily plan
// @route   POST /api/daily-planners
// @access  Private
const createDailyPlanner = async (req, res) => {
  const { dailyDate, week, month, year, submitter, data } = req.body;
  if (!dailyDate || !week || !month || !year || !submitter) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }
  try {
    const dailyPlanner = await prisma.dailyPlanner.create({
      data: {
        dailyDate: new Date(dailyDate),
        week: parseInt(week),
        month: parseInt(month),
        year: parseInt(year),
        submitter,
        data: data ? JSON.stringify(data) : null,
      },
    });
    res.status(201).json(dailyPlanner);
  } catch (error) {
    console.error("Error creating daily planner:", error);
    res.status(500).json({ message: "Failed to create daily planner" });
  }
};

// @desc    Update daily plan
// @route   PUT /api/daily-planners/:id
// @access  Private
const updateDailyPlanner = async (req, res) => {
  const { dailyDate, week, month, year, submitter, data } = req.body;
  try {
    const dailyPlanner = await prisma.dailyPlanner.update({
      where: { id: parseInt(req.params.id) },
      data: {
        dailyDate: new Date(dailyDate),
        week: parseInt(week),
        month: parseInt(month),
        year: parseInt(year),
        submitter,
        data: data ? JSON.stringify(data) : null,
      },
    });
    res.status(200).json(dailyPlanner);
  } catch (error) {
    console.error("Error updating daily planner:", error);
    res.status(500).json({ message: "Failed to update daily planner" });
  }
};

// @desc    Delete daily plan
// @route   DELETE /api/daily-planners/:id
// @access  Private/Admin
const deleteDailyPlanner = async (req, res) => {
  try {
    await prisma.dailyPlanner.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(200).json({ message: "Daily plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting daily plan:", error);
    res.status(500).json({ message: "Failed to delete daily plan" });
  }
};

export {
  getDailyPlanners,
  getDailyPlanner,
  createDailyPlanner,
  updateDailyPlanner,
  deleteDailyPlanner,
};
