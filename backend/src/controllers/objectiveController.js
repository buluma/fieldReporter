import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getObjectives,
  getActivity: getObjective,
  createActivity: createObjective,
  updateActivity: updateObjective,
  deleteActivity: deleteObjective,
} = createActivityController("Objective");

export {
  getObjectives,
  getObjective,
  createObjective,
  updateObjective,
  deleteObjective,
};
