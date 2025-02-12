
import axiosInstance from "../../axiosInstance";

const monthlyConsumptionBillApi = {
  consumptionBill: (bill) => {
    return axiosInstance.post(`/energy/upload-monthly-consumption-bill`,bill); 
  },
};

export default monthlyConsumptionBillApi;
