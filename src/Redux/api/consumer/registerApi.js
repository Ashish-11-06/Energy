import axiosInstance from "../axiosInstance";

const registerApi = {
  registerUser: (userData) => {
    return axiosInstance.post(`/accounts/register`, userData); 
  },

  verifyOTP: (otp) => {
    return axiosInstance.post(`/accounts/verify-otp`, otp );
  },
};

export default registerApi;
