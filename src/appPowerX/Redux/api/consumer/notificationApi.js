import axiosInstance from "../../axiosInstance";

const notificationApi = {
  getNotification: (userId) => {
    console.log(userId);
    console.log("User ID:", userId, typeof userId);
    const id = Number(userId); 
    return axiosInstance.get(`/notifications?id=${id}`);
},
  updateNotification: (data) => {
    return axiosInstance.patch(`/notification`, data); // Correct the endpoint
  }
};

export default notificationApi;
