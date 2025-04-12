import axiosInstance from "../../../../Redux/axiosInstance";

const dashboardApi ={
    fetchDashboardG: (id) => {
        // console.log(id); 
        return axiosInstance.get(`/powerx/generator-dashboard/${id}`);
    },
    fetchDashboardLineG: (id) => {
        return axiosInstance.get(`/powerx/day-ahead-generation/${id}`);
    },
};

export default dashboardApi;