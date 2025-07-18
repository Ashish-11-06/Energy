import axiosInstance from '../axiosInstance';

const consumerApi = {
    getConsumerList: () => {
        return axiosInstance.get(`/consumer`);
    },
    editConsumer: ({data,id}) => {
        return axiosInstance.put(`/consumer/${id}`,data);
    },
    deleteConsumer: (id) => {
        console.log('id in api delete',id);
        
        return axiosInstance.delete(`/consumer/${id}`);
    },
}

export default consumerApi;