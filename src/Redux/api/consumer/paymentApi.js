
import axiosInstance from "../../axiosInstance";

const paymentAPI = {
    payment: ({ amount, currency }) => {
      return axiosInstance.post(`/energy/create-order`, { amount, currency });
    },

    completePayment: (paymentData) => {
      return axiosInstance.post(`/energy/payment-transaction-complete`, paymentData);
    },
  };

  
  
  export default paymentAPI;


