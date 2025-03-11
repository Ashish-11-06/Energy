import axiosInstance from "../../axiosInstance";

const modelStatisticsApi ={
    modelStatistics: () => {
        return axiosInstance.get('/model-statistics');
    }
};

export default modelStatisticsApi;