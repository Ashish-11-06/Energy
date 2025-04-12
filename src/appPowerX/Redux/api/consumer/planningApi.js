import axiosInstance from "../../../../Redux/axiosInstance";

const planningApi ={
    getPlanningData: (id) => {
        return axiosInstance.get(`/powerx/consumer-month-ahead-demand/${id}`);
    }
};

export default planningApi;