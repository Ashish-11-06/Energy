import axiosInstance from '../axiosInstance';

const demandDataApi = {
    getData: () => {
        return axiosInstance.get(`/demand-data`);
    },
    editData: ({data,id}) => {
        return axiosInstance.put(`/demand-data/${id}`,data);
    }
}

export default demandDataApi;