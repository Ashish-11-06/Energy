import axiosInstance from '../axiosInstance';

const RETariffApi = {
    getData: () => {
        return axiosInstance.get(`/re-tariff`);
    },
    editData: ({data,id}) => {
        return axiosInstance.put(`/re-tariff/${id}`,data);
    },
    deleteData: (id) => {
        return axiosInstance.delete(`/re-tariff/${id}`);
    },
    addData: (data) => {
        return axiosInstance.post(`/re-tariff`, data);
    },
}

export default RETariffApi;