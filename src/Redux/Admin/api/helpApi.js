import axiosInstance from '../axiosInstance';

const helpApi = {
    getData: () => {
        return axiosInstance.get(`/queries`);
    },
    editData: (id, data) => {
        return axiosInstance.put(`/queries/${id}`, data);
    },
}

export default helpApi;