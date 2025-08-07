import axiosInstance from '../axiosInstance';

const nationalHolidayApi = {
    getData: () => {
        return axiosInstance.get(`/national-holidays`);
    },
    editData: ({data,id}) => {
        return axiosInstance.put(`/national-holidays/${id}`,data);
    },
    deleteData: (id) => {
        return axiosInstance.delete(`/national-holidays/${id}`);
    },
    addData: (data) => {
        return axiosInstance.post(`/national-holidays`, data);
    }
}

export default nationalHolidayApi;