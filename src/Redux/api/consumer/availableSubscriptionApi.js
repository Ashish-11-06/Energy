
import axiosInstance from "../axiosInstance";

const availableSubscriptionApi = {
  availableSubscription: () => {
    return axiosInstance.get(`/energy/subscription-plans/Consumer`); 
  },
};

export default availableSubscriptionApi;
