import axiosInstance2 from "../../axiosInstance";

const optimizeCapacityApi = {
  // Fetch all projects by ID
  getOptimizedCombination: (modalData) => {
    return axiosInstance2.post(`/energy/optimize-capactiy`, modalData);
  },

};

export default optimizeCapacityApi;