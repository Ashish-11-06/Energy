import axiosInstance from '../axiosInstance';

const subscriptionApi = {
    onlineSubscription: () => {
        return axiosInstance.get(`/online-subscriptions`);
    },
    offlineSubscription: () => {
        return axiosInstance.get(`/offline-subscriptions`);
    },
}

export default subscriptionApi;