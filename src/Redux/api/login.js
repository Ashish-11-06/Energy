import axiosInstance from './axiosInstance.js';

const loginApi = {
    login: (credentials) => {
        return axiosInstance.post('/auth/login', credentials);
    },
};

export default loginApi;
