import axiosInstance from '../axiosInstance';

const consumerApi = {
    getConsumerList: () => {
        return axiosInstance.get(`/consumer`);
    },
    editConsumer: ({data,id}) => {
        return axiosInstance.put(`/consumer/${id}`,data);
    },
    deleteConsumer: (id) => {
        // console.log('id in api delete',id);
        
        return axiosInstance.delete(`/consumer/${id}`);
    },
    getCreditRatingList: () => {
        return axiosInstance.get(`/credit_rating`);
    },
    updateCreditRatingStatus: ({ user_id, credit_rating_status }) => {
        return axiosInstance.put(`/credit_rating`, { user_id, credit_rating_status });
    },
}

export default consumerApi;