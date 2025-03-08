import axiosInstance from "../axiosInstance";

const userApi = {
  login: (userData) => {
    console.log(userData);   
    return axiosInstance.post('/user', userData);
  },
};

export default userApi;