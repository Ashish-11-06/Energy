import axiosInstance from '../axiosInstance';

const peakHoursApi = {
    getData: () => {
        return axiosInstance.get(`/peak-hours`);
    },
    editData: ({data,id}) => {
        return axiosInstance.put(`/peak-hours/${id}`,data);
    },
    deleteData: (id) => {
        return axiosInstance.delete(`/peak-hours/${id}`);
    },
}

export default peakHoursApi;