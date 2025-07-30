import axiosInstance from '../axiosInstance';

const masterTableApi = {
    getData: () => {
        return axiosInstance.get(`/master-table`);
    },
    editData: ({data,id}) => {
        return axiosInstance.put(`/master-table/${id}`,data);
    },
    deleteData: (id) => {
        return axiosInstance.delete(`/master-table/${id}`);
    },
}

export default masterTableApi;