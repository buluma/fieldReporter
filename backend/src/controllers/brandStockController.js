import prisma from "../../config/prismaClient.js";

// @desc    Get all brand stocks
// @route   GET /api/brand-stocks
// @access  Private
const getBrandStocks = async (req, res) => {
  try {
    const brandStocks = await prisma.brandStock.findMany({
      orderBy: { createdOn: "desc" },
    });
    res.status(200).json(brandStocks);
  } catch (error) {
    console.error("Error fetching brand stocks:", error);
    res.status(500).json({ message: "Failed to fetch brand stocks" });
  }
};

// @desc    Get single brand stock
// @route   GET /api/brand-stocks/:id
// @access  Private
const getBrandStock = async (req, res) => {
  try {
    const brandStock = await prisma.brandStock.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (brandStock) {
      res.status(200).json(brandStock);
    } else {
      res.status(404).json({ message: "Brand stock not found" });
    }
  } catch (error) {
    console.error("Error fetching brand stock:", error);
    res.status(500).json({ message: "Failed to fetch brand stock" });
  }
};

// @desc    Create new brand stock
// @route   POST /api/brand-stocks
// @access  Private
const createBrandStock = async (req, res) => {
  const { storeId, brandId, data } = req.body;
  if (!storeId || !brandId) {
    return res.status(400).json({ message: "Please provide storeId and brandId" });
  }
  try {
    const brandStock = await prisma.brandStock.create({
      data: {
        storeId,
        brandId: parseInt(brandId),
        data: data ? JSON.stringify(data) : null,
      },
    });
    res.status(201).json(brandStock);
  } catch (error) {
    console.error("Error creating brand stock:", error);
    res.status(500).json({ message: "Failed to create brand stock" });
  }
};

// @desc    Update brand stock
// @route   PUT /api/brand-stocks/:id
// @access  Private
const updateBrandStock = async (req, res) => {
  const { storeId, brandId, data } = req.body;
  try {
    const brandStock = await prisma.brandStock.update({
      where: { id: parseInt(req.params.id) },
      data: {
        storeId,
        brandId: parseInt(brandId),
        data: data ? JSON.stringify(data) : null,
      },
    });
    res.status(200).json(brandStock);
  } catch (error) {
    console.error("Error updating brand stock:", error);
    res.status(500).json({ message: "Failed to update brand stock" });
  }
};

// @desc    Delete brand stock
// @route   DELETE /api/brand-stocks/:id
// @access  Private/Admin
const deleteBrandStock = async (req, res) => {
  try {
    await prisma.brandStock.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(200).json({ message: "Brand stock deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand stock:", error);
    res.status(500).json({ message: "Failed to delete brand stock" });
  }
};

export {
  getBrandStocks,
  getBrandStock,
  createBrandStock,
  updateBrandStock,
  deleteBrandStock,
};
