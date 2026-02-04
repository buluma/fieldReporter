import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getPerformances,
  getActivity: getPerformance,
  createActivity: createPerformance,
  updateActivity: updatePerformance,
  deleteActivity: deletePerformance,
} = createActivityController("Performance");

export {
  getPerformances,
  getPerformance,
  createPerformance,
  updatePerformance,
  deletePerformance,
};
