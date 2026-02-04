import prisma from "../../config/prismaClient.js";

// @desc    Get all brands
// @route   GET /api/brands
// @access  Private
const getBrands = async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Failed to fetch brands" });
  }
};

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Private
const getBrand = async (req, res) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (brand) {
      res.status(200).json(brand);
    } else {
      res.status(404).json({ message: "Brand not found" });
    }
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({ message: "Failed to fetch brand" });
  }
};

// @desc    Create new brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Please add a brand name" });
  }
  try {
    const brand = await prisma.brand.create({
      data: { name },
    });
    res.status(201).json(brand);
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({ message: "Failed to create brand" });
  }
};

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = async (req, res) => {
  const { name } = req.body;
  try {
    const brand = await prisma.brand.update({
      where: { id: parseInt(req.params.id) },
      data: { name },
    });
    res.status(200).json(brand);
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ message: "Failed to update brand" });
  }
};

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = async (req, res) => {
  try {
    await prisma.brand.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Failed to delete brand" });
  }
};

export { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
