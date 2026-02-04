import prisma from "../../config/prismaClient.js";

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private
const getStores = async (req, res) => {
  const stores = await prisma.store.findMany();
  res.status(200).json(stores);
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Private
const getStore = async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { id: req.params.id },
  });

  if (store) {
    res.status(200).json(store);
  } else {
    res.status(404).json({ message: "Store not found" });
  }
};

// @desc    Create new store
// @route   POST /api/stores
// @access  Private/Admin
const createStore = async (req, res) => {
  const { name, region, userId, latitude, longitude } = req.body;

  if (!name || !region) {
    return res.status(400).json({ message: "Please add a name and region" });
  }

  const store = await prisma.store.create({
    data: {
      name,
      region,
      userId, // Assuming userId is passed or derived from auth
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    },
  });

  res.status(201).json(store);
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private/Admin
const updateStore = async (req, res) => {
  const { name, region, userId, latitude, longitude } = req.body;

  const store = await prisma.store.update({
    where: { id: req.params.id },
    data: {
      name,
      region,
      userId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    },
  });

  if (store) {
    res.status(200).json(store);
  } else {
    res.status(404).json({ message: "Store not found" });
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private/Admin
const deleteStore = async (req, res) => {
  const store = await prisma.store.delete({
    where: { id: req.params.id },
  });

  if (store) {
    res.status(200).json({ message: "Store removed" });
  } else {
    res.status(404).json({ message: "Store not found" });
  }
};

export { getStores, getStore, createStore, updateStore, deleteStore };
