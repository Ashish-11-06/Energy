import axiosInstance from "../../../../Redux/axiosInstance";

const dashboardApi ={
    fetchDashboard: (id) => {
        // console.log(id);
        
        return axiosInstance.get(`/powerx/consumer-dashboard/${id}`);
    },
    fetchDashboardLine: (id) => {
        return axiosInstance.get(`/powerx/consumer-day-ahead-demand/${id}`);
    },
};

export default dashboardApi;