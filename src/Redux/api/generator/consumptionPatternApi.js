import axiosInstance from "../../axiosInstance";

const consumptionPatternApi = {
  // Fetch all projects by ID
  getConsumptionPattern: (id) => {
    return axiosInstance.get(`/energy/consumption-pattern/${id}`);
  },

};

export default consumptionPatternApi;
