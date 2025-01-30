import axiosInstance from "../axiosInstance";

const subscriptionEnrollApi = {
  subscriptionEnroll: (subscriptionData) => {
    return axiosInstance.post(`/energy/subscriptions`, subscriptionData); 
  },
  subscriptionValidity:(id)=>{
    return axiosInstance.get(`/energy/subscriptions/${id}`);
  }
};

export default subscriptionEnrollApi;
