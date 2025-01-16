
import axiosInstance from "../axiosInstance";

const notificationApi = {
  notification: (id) => {
    return axiosInstance.get(`/energy/notifications/${id}`); 
  },
};

export default notificationApi;
