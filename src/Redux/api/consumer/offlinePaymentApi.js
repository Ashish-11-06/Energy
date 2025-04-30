
import axiosInstance from "../../axiosInstance";

const offlinePaymentApi = {
  addOfflinePayment: (data) => {
    return axiosInstance.post(`/energy/offline-payment`, data); 
  },
};

export default offlinePaymentApi;
