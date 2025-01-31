
import axiosInstance from "../axiosInstance";

const availableSubscriptionPlanApi = {
  availableSubscriptionPlan: () => {
    return axiosInstance.get(`/energy/subscription-plans/Generator`); 
  },
};

export default availableSubscriptionPlanApi;
