import createActivityController from "../utils/activityUtils.js";

const {
  getActivities: getChecklists,
  getActivity: getChecklist,
  createActivity: createChecklist,
  updateActivity: updateChecklist,
  deleteActivity: deleteChecklist,
} = createActivityController("Checklist");

export {
  getChecklists,
  getChecklist,
  createChecklist,
  updateChecklist,
  deleteChecklist,
};
