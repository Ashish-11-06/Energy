import axiosInstance from '../axiosInstance';

const subscriptionApi = {
    onlineSubscription: () => {
        return axiosInstance.get(`/online-subscriptions`);
    },
    offlineSubscription: () => {
        return axiosInstance.get(`/offline-subscriptions`);
    },
    offlineSubscriptionStatus: (id, data) => {
        return axiosInstance.put(`/offline-subscription/${id}`, data);
    },
    getSubscriptionPlan : () => {
        return axiosInstance.get(`/subscription-plans`);
    },
    editPlan: ({id,data}) => {
        return axiosInstance.put(`/subscription-plan/${id}`, data);
    },
    deletePlan: (id) => {
        return axiosInstance.delete(`/subscription-plans/${id}`);
    },
}

export default subscriptionApi;