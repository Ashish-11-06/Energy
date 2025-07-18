import axiosInstance from '../axiosInstance';

const dashboardApi = {
    getDashboardData: () => {
        return axiosInstance.get(`/dashboard`);
    },
}

export default dashboardApi;