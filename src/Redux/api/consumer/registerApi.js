
import axiosInstance from "../axiosInstance";

const registernApi = {
  register: () => {
    return axiosInstance.get(`/accounts/register`); 
  },
};

export default registernApi;
