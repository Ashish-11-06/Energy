import axiosInstance from "../../axiosInstance";

const tradingApi ={
    fetchTrading: () => {
        return axiosInstance.get('/tradingData');
    }
};

export default tradingApi;