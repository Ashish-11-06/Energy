import axiosInstance from "../../axiosInstance";

const monthlyconsumptionApi = {

    monthlyconsumptionData: (monthlyData) => {
        // console.log(monthlyData);
        return axiosInstance.post('/energy/monthly-consumption', monthlyData);
    },
    getMonthlyConsumption: (id) => {
        return axiosInstance.get(`/energy/monthly-consumption/${id}`);
    }
};

export default monthlyconsumptionApi;