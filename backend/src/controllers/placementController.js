import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getPlacements,
  getActivity: getPlacement,
  createActivity: createPlacement,
  updateActivity: updatePlacement,
  deleteActivity: deletePlacement,
} = createActivityController("Placement");

export {
  getPlacements,
  getPlacement,
  createPlacement,
  updatePlacement,
  deletePlacement,
};
