
import axiosInstance from "../../axiosInstance";

const AnnualSavingAPI = {
  getAnnualSaving: (data) => {
    return axiosInstance.post(`/energy/annual-saving`, data); 
  },
};

export default AnnualSavingAPI;
