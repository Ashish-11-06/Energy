import axiosInstance from "../../axiosInstance";

const dashboardApi ={
    fetchDashboardG: (id) => {
        console.log(id); 
        return axiosInstance.get(`/generator-dashboard/${id}`);
    },
    fetchDashboardLineG: (id) => {
        return axiosInstance.get(`/day-ahead-generation/${id}`);
    },
};

export default dashboardApi;