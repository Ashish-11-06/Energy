import axiosInstance2 from "../../axiosInstance";

const capacitySizingApi = {
  // Fetch all projects by ID
  getCapacitySizing: (modalData = {}) => {
    return axiosInstance2.post(`/energy/capacity-sizing`, modalData); // Ensure modalData is passed correctly
  },

};

export default capacitySizingApi;