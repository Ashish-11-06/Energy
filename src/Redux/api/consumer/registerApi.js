import axiosInstance from "../axiosInstance";

const registerApi = {
  registerUser: (userData) => {
    return axiosInstance.post(`/accounts/register`, userData); 
  },

  verifyOTP: (otp) => {
    return axiosInstance.post(`/accounts/verify-otp`, otp );
  },

  addSubUser: (id, data) => {
    return axiosInstance.post(`/accounts/add-sub-user/${id}`, data);
},
};

export default registerApi;
