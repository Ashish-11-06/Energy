import axiosInstance from "../axiosInstance";

const transactionWindowApi = {
  // Fetch all projects by ID
  getTransactions: (userId) => {
    return axiosInstance.post(`/energy/negotiate-window/${userId}`);
  },

};

export default transactionWindowApi;