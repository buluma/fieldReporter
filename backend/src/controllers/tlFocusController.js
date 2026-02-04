import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getTLFocuses,
  getActivity: getTLFocus,
  createActivity: createTLFocus,
  updateActivity: updateTLFocus,
  deleteActivity: deleteTLFocus,
} = createActivityController("TLFocus");

export {
  getTLFocuses,
  getTLFocus,
  createTLFocus,
  updateTLFocus,
  deleteTLFocus,
};
