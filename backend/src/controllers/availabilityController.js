import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getAvailabilities,
  getActivity: getAvailability,
  createActivity: createAvailability,
  updateActivity: updateAvailability,
  deleteActivity: deleteAvailability,
} = createActivityController("Availability");

export {
  getAvailabilities,
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
};
