import axiosInstance from "../../axiosInstance";

const consumerrequirementApi = {
    getAllrequirementsById: (id) => {
        return axiosInstance.get(`/energy/consumer-requirements/${id}`);
    },
    register: (userData) => {
        return axiosInstance.post('/accounts/register', userData);
    },
    updaterequirement: (updatedData) => {
        // console.log(updatedData);
        
        return axiosInstance.put(`/energy/consumer-requirements/${updatedData.id}`, updatedData);
    },
    deleterequirement: (id) => {
        return axiosInstance.delete(`/energy/consumer-requirements/${id}`);
    },
    addRequirement: (requirementData) => {
        return axiosInstance.post('/energy/consumer-requirements', requirementData);
    },
};

export default consumerrequirementApi;