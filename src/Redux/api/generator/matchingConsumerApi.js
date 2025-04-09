import axiosInstance from "../../axiosInstance";

const matchingConsumerApi = {
  // Fetch all projects by ID
  getMatchingConsumersById: (id) => {
    return axiosInstance.get(`/energy/matching-consumer/${id}`);
  },
  checkStatus: (id) => {
    return axiosInstance.get(`/energy/portfolio_update_status/${id}`);
  },



};

export default matchingConsumerApi;
