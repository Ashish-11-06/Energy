import axiosInstance from "./axiosInstance";

const DashboardApi = {
    getConsumerDashboardData: (id) => {
        return axiosInstance.get(`/energy/consumer-dashboard/${id}`);
    },
    getGeneratorDashboardData: (id) => {
        return axiosInstance.get(`/energy/generator-dashboard/${id}`);
    },
};

export default DashboardApi;