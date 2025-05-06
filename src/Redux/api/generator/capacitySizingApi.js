import axiosInstance from "../../axiosInstance";

const capacitySizingApi = {
  // Fetch all projects by ID
  getCapacitySizing: (modalData = {}) => {
    return axiosInstance.post(`/energy/capacity-sizing`, modalData);
  },
  saveCapacitySizingData: (data) => {
    // console.log('data in api',data);
    return axiosInstance.post(`/energy/capacity-sizing-combination`, data); 
  },
  getCapacitySizingData: (id) => {
    return axiosInstance.get(`/energy/capacity-sizing-combination/${id}`); 
  },

};

export default capacitySizingApi;