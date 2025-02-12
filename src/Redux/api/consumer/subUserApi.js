
import axiosInstance from "../../axiosInstance";

const subUserApi = {
  subUser: (id) => {
    return axiosInstance.get(`/accounts/sub-users/${id}`); 
  },
};

export default subUserApi;
