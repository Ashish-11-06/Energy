import axiosInstance from "../axiosInstance";

const matchingConsumerApi = {
  // Fetch all projects by ID
  getMatchingConsumersById: (id) => {
    return axiosInstance.get(`/energy/matching-consumer/${id}`);
  },

};

export default matchingConsumerApi;
