import axiosInstance from "../../axiosInstance";

const dashboardApi ={
    fetchDashboard: () => {
        return axiosInstance.get('/dashboardData');
    },
    fetchDashboardLine: () => {
        return axiosInstance.get('/dashboardLineData');
    },
};

export default dashboardApi;