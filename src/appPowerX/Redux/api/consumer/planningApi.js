import axiosInstance from "../../axiosInstance";

const planningApi ={
    getPlanningData: (id) => {
        return axiosInstance.get(`/consumer-month-ahead-demand/${id}`);
    }
};

export default planningApi;