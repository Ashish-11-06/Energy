import axiosInstance from '../axiosInstance';

const helpApi = {
    getData: () => {
        return axiosInstance.get(`/queries`);
    },
    editData: ({data,id}) => {
        return axiosInstance.put(`/queries/${id}`, data);
    },
   
}

export default helpApi;