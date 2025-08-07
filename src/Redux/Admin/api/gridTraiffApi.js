import axiosInstance from '../axiosInstance';

const gridTraiffApi = {
    getData: () => {
        return axiosInstance.get(`/grid-tariff`);
    },
    editData: ({data,id}) => {
        return axiosInstance.put(`/grid-tariff/${id}`,data);
    },
    deleteData: (id) => {
        return axiosInstance.delete(`/grid-tariff/${id}`);
    },
    addData: (data) => {
        return axiosInstance.post(`/grid-tariff`, data);
    }
}

export default gridTraiffApi;