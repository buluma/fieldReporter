import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getListings,
  getActivity: getListing,
  createActivity: createListing,
  updateActivity: updateListing,
  deleteActivity: deleteListing,
} = createActivityController("Listing");

export {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
};
