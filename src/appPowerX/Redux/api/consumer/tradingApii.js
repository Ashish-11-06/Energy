import axiosInstance from "../../../../Redux/axiosInstance";

const tradingApi ={
    fetchTrading: () => {
        return axiosInstance.get('/powerx/tradingData');
    }
};

export default tradingApi;