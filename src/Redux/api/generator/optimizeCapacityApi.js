import axiosInstance2 from "../axiosInstance2";

const optimizeCapacityApi = {
  // Fetch all projects by ID
  getOptimizedCombination: (modalData) => {
    return axiosInstance2.post(`/energy/optimize-capactiy`, modalData);
  },

};

export default optimizeCapacityApi;