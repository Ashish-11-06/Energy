import axiosInstance from "../../../../Redux/axiosInstance";

const modelStatisticsApi ={
    modelStatistics: () => {
        return axiosInstance.get('/powerx/model-statistics');
    },
    modelStatisticsMonth: () => {
        return axiosInstance.get('/powerx/model-statistics-month');
    },

};

export default modelStatisticsApi;