
import axiosInstance from "../../axiosInstance";

const sensitivityAPI = {
  getsensitivity: (data) => {
    return axiosInstance.post(`/energy/sensitivity`, data); 
  },
};

export default sensitivityAPI;
