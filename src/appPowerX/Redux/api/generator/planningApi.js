import axiosInstance from "../../../../Redux/axiosInstance";

const planningApi ={
    getPlanningData: (id) => {
        return axiosInstance.get(`/powerx/month-ahead-generation/${id}`);
    }
};

export default planningApi;