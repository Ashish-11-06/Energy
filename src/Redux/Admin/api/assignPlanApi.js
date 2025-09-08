import axiosInstance from '../axiosInstance';

const assignPlanApi = {
  // Assign plan to a user
  assignPlan: ({ user_id, subscription_id }) => {
    return axiosInstance.post(`/assign-plan`, { user_id, subscription_id });
  },
}
export default assignPlanApi;