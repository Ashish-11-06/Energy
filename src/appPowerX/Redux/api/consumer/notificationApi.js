import axiosInstance from "../../axiosInstance";

const notificationApi = {
  getNotification: (userId) => {
    console.log(userId);
   
    return axiosInstance.get(`/notifications?${userId}`);
  },
  updateNotification: (data) => {
    return axiosInstance.patch(`/notification`, data); // Correct the endpoint
  }
};

export default notificationApi;
