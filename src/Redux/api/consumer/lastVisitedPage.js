
import axiosInstance from "../../axiosInstance";

const lastVisitedAPI = {
  lastVisitedPage: (data) => {
    return axiosInstance.post(`/energy/last-visited-page`, data); 
  },
};

export default lastVisitedAPI;
