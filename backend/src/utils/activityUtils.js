import prisma from "../../config/prismaClient.js";

const createActivityController = (modelName) => {
  const model = prisma[modelName.toLowerCase()]; // Get Prisma model dynamically

  // @desc    Get all activities
  // @route   GET /api/:modelName (e.g., /api/availabilities)
  // @access  Private/Admin
  const getActivities = async (req, res) => {
    try {
      const activities = await model.findMany({
        orderBy: { createdOn: "desc" },
      });
      res.status(200).json(activities);
    } catch (error) {
      console.error(`Error fetching ${modelName}s:`, error);
      res.status(500).json({ message: `Failed to fetch ${modelName}s` });
    }
  };

  // @desc    Get single activity
  // @route   GET /api/:modelName/:id
  // @access  Private/Admin
  const getActivity = async (req, res) => {
    try {
      const activity = await model.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (activity) {
        res.status(200).json(activity);
      } else {
        res.status(404).json({ message: `${modelName} not found` });
      }
    } catch (error) {
      console.error(`Error fetching ${modelName}:`, error);
      res.status(500).json({ message: `Failed to fetch ${modelName}` });
    }
  };

  // @desc    Create new activity
  // @route   POST /api/:modelName
  // @access  Private
  const createActivity = async (req, res) => {
    const { storeId, data } = req.body;
    if (!storeId) {
      return res.status(400).json({ message: "Please provide storeId" });
    }
    try {
      const activity = await model.create({
        data: {
          storeId,
          data: data ? JSON.stringify(data) : null,
        },
      });
      res.status(201).json(activity);
    } catch (error) {
      console.error(`Error creating ${modelName}:`, error);
      res.status(500).json({ message: `Failed to create ${modelName}` });
    }
  };

  // @desc    Update activity
  // @route   PUT /api/:modelName/:id
  // @access  Private
  const updateActivity = async (req, res) => {
    const { storeId, data } = req.body;
    try {
      const activity = await model.update({
        where: { id: parseInt(req.params.id) },
        data: {
          storeId,
          data: data ? JSON.stringify(data) : null,
        },
      });
      res.status(200).json(activity);
    } catch (error) {
      console.error(`Error updating ${modelName}:`, error);
      res.status(500).json({ message: `Failed to update ${modelName}` });
    }
  }

  // @desc    Delete activity
  // @route   DELETE /api/:modelName/:id
  // @access  Private/Admin
  const deleteActivity = async (req, res) => {
    try {
      await model.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.status(200).json({ message: `${modelName} deleted successfully` });
    } catch (error) {
      console.error(`Error deleting ${modelName}:`, error);
      res.status(500).json({ message: `Failed to delete ${modelName}` });
    }
  };

  return { getActivities, getActivity, createActivity, updateActivity, deleteActivity };
};

export default createActivityController;
