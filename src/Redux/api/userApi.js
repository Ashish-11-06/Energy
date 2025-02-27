
import axiosInstance from '../axiosInstance';

const userApi = {
    logInUser: (credentials) => {
        return axiosInstance.post(`/accounts/login`, credentials);
    },
    RegisterUser: (userData) => {
        return axiosInstance.post('/accounts/register', userData);
    },

     // Forgot Password APIs
     sendForgotPasswordOtp: (email) => {
        return axiosInstance.get(`/accounts/forgot-password/${email}`);
    },

    verifyForgotPasswordOtp: (data) => {
        return axiosInstance.post('/accounts/verify-forgot-password-otp', data);
    },

    setNewPassword: (data) => {
        return axiosInstance.post('/accounts/set-new-password', data);
    },

    getAllusers: () => {
        return axiosInstance.get('/users/all');
    },
    
    getUserById: (id) => {
        return axiosInstance.get(`/users/get/${id}`);
    },
    verifyEmail: (data) => {
        return axiosInstance.post(`/accounts/email/${data.token}`, data);
    },

   
    
   
    
    updateuser: (id, userData) => {
        return axiosInstance.put(`/users/update/${id}`, userData);
    },

    getuserByRole: (role) => {
        return axiosInstance.get(`/users/get/role/${role}`);
    },
    
    deleteuser: (id) => {
        return axiosInstance.delete(`/users/${id}`);
    },
};

export default userApi;