import axiosInstance from "../../axiosInstance";

const dashboardApi ={
    fetchDashboard: (id) => {
        // console.log(id);
        
        return axiosInstance.get(`/consumer-dashboard/${id}`);
    },
    fetchDashboardLine: (id) => {
        return axiosInstance.get(`/consumer-day-ahead-demand/${id}`);
    },
};

export default dashboardApi;