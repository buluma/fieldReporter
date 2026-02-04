import prisma from "../../config/prismaClient.js";

// @desc    Sync bulk data from client
// @route   POST /api/data/sync
// @access  Private
const syncData = async (req, res) => {
  const { stores, users, ...otherData } = req.body;

  try {
    // Upsert stores
    if (stores && Array.isArray(stores)) {
      for (const storeData of stores) {
        await prisma.store.upsert({
          where: { id: storeData.id },
          update: storeData,
          create: storeData,
        });
      }
    }

    // Upsert users (consider roles and permissions if allowing client to send user data)
    // For now, only update if user exists, otherwise create.
    if (users && Array.isArray(users)) {
      for (const userData of users) {
        // Exclude passwordHash from client sync for security, unless explicitly handled
        const { passwordHash, ...safeUserData } = userData;
        await prisma.user.upsert({
          where: { id: safeUserData.id },
          update: safeUserData,
          create: safeUserData, // This might need more robust handling for new users
        });
      }
    }

    // Handle other data similarly based on schema
    // Example for a generic "Activity" model if it existed:
    // if (otherData.activities && Array.isArray(otherData.activities)) {
    //   for (const activityData of otherData.activities) {
    //     await prisma.activity.upsert({
    //       where: { id: activityData.id },
    //       update: activityData,
    //       create: activityData,
    //     });
    //   }
    // }

    res.status(200).json({ message: "Data synced successfully" });
  } catch (error) {
    console.error("Error syncing data:", error);
    res.status(500).json({ message: "Failed to sync data", error: error.message });
  }
};

export { syncData };