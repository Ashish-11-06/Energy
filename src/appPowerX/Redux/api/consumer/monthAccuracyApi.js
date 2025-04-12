import axiosInstance from "../../../../Redux/axiosInstance";

const monthAccuracyApi ={
    fetchAccuracy: () => {
        return axiosInstance.get('/powerx/accuracyData');
    }
};

export default monthAccuracyApi;