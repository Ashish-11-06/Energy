import axiosInstance from "../../../../Redux/axiosInstance";

const notificationApi = {
  getNotification: (userId) => {
    // console.log(userId);
    // console.log("User ID:", userId, typeof userId);
    const id = Number(userId); 
    return axiosInstance.get(`/powerx/notifications/${id}`);
},
  updateNotification: (data) => {
    return axiosInstance.patch(`/powerx/notification`, data); // Correct the endpoint
  }
};

export default notificationApi;
