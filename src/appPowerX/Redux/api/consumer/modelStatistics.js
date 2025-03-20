import axiosInstance from "../../axiosInstance";

const modelStatisticsApi ={
    modelStatistics: () => {
        return axiosInstance.get('/model-statistics');
    },
    modelStatisticsMonth: () => {
        return axiosInstance.get('/model-statistics-month');
    },

};

export default modelStatisticsApi;