import axiosInstance from './axiosInstance';

const userApi = {
    logInUser: (credentials) => {
        return axiosInstance.post(`/accounts/login/`, credentials);
    },
    RegisterUser: (userData) => {
        return axiosInstance.post('/accounts/register', userData);
    },
    getAllusers: () => {
        return axiosInstance.get('/users/all');
    },
    // rem
    getUserById: (id) => {
        return axiosInstance.get(`/users/get/${id}`);
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