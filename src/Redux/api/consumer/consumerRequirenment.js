import axiosInstance from "../../axiosInstance";

const consumerrequirementApi = {
    getAllrequirementsById: (id) => {
        return axiosInstance.get(`/energy/consumer-requirements/${id}`);
    },
    register: (userData) => {
        return axiosInstance.post('/accounts/register', userData);
    },
    updaterequirement: (id, updatedData) => {
        return axiosInstance.put(`/energy/consumer-requirements/${id}`, updatedData);
    },
    deleterequirement: (id) => {
        return axiosInstance.delete(`/energy/consumer-requirements/${id}`);
    },
};

export default consumerrequirementApi;
