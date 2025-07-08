import axiosInstance from '../../axiosInstance';

const loginApi = {
    loginUser: (credentials) => {
        console.log('data api',credentials);
        
        return axiosInstance.post(`/accounts/login`, credentials);
    },
}

export default loginApi;