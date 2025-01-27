
import axiosInstance from "../axiosInstance";

const industryApi = {
  industry: () => {
    return axiosInstance.get(`/energy/industry-list`); 
  },
};

export default industryApi;
