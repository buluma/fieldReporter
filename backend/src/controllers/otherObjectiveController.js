import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getOtherObjectives,
  getActivity: getOtherObjective,
  createActivity: createOtherObjective,
  updateActivity: updateOtherObjective,
  deleteActivity: deleteOtherObjective,
} = createActivityController("OtherObjective");

export {
  getOtherObjectives,
  getOtherObjective,
  createOtherObjective,
  updateOtherObjective,
  deleteOtherObjective,
};
