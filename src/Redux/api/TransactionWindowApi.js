import axiosInstance from "./axiosInstance";

const transactionWindowApi = {
  // Fetch all projects by ID
  getAllTransactions: (userId) => {
    return axiosInstance.get(`/energy/negotiate-window-list/${userId}`);
  },

};

export default transactionWindowApi;