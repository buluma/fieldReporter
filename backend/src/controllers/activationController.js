import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getActivations,
  getActivity: getActivation,
  createActivity: createActivation,
  updateActivity: updateActivation,
  deleteActivity: deleteActivation,
} = createActivityController("Activation");

export {
  getActivations,
  getActivation,
  createActivation,
  updateActivation,
  deleteActivation,
};
