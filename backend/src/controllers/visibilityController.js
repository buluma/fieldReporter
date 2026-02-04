import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getVisibilities,
  getActivity: getVisibility,
  createActivity: createVisibility,
  updateActivity: updateVisibility,
  deleteActivity: deleteVisibility,
} = createActivityController("Visibility");

export {
  getVisibilities,
  getVisibility,
  createVisibility,
  updateVisibility,
  deleteVisibility,
};
