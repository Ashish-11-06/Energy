import axiosInstance from "../../axiosInstance";

const monthAccuracyApi ={
    fetchAccuracy: () => {
        return axiosInstance.get('/accuracyData');
    }
};

export default monthAccuracyApi;