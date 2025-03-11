import axiosInstance from "../../axiosInstance";

const planningApi ={
    getPlanningData: (id) => {
        return axiosInstance.get(`/month-ahead-generation/${id}`);
    }
};

export default planningApi;