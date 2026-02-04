import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getTLObjectives,
  getActivity: getTLObjective,
  createActivity: createTLObjective,
  updateActivity: updateTLObjective,
  deleteActivity: deleteTLObjective,
} = createActivityController("TLObjective");

export {
  getTLObjectives,
  getTLObjective,
  createTLObjective,
  updateTLObjective,
  deleteTLObjective,
};
