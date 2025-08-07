import axiosInstance from '../axiosInstance';

const notificationApi = {
    addData: (data) => {
        return axiosInstance.post(`/send-notification`, data);
    }
}

export default notificationApi;