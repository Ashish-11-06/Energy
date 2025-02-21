import axiosInstance from "../../axiosInstance";

const dashboardApi ={
    fetchDashboard: () => {
        return axiosInstance.get('/dashboardData');
    },
};

export default dashboardApi;