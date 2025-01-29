import axiosInstance from "./axiosInstance";

const termSheetApi = {
  // Fetch all projects by ID
  getTermSheet: (user) => {
    return axiosInstance.get(`/energy/terms-sheet/${user.id}`);
  },

};

export default termSheetApi;