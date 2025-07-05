import axiosInstance from "../../axiosInstance";

const consumptionPatternApi = {
  // Fetch all projects by ID
  getConsumptionPattern: ({ id, user_id }) => {
 // console.log(user_id); // Retain the console log for debugging
    return axiosInstance.get(`/energy/consumption-pattern/${id}/${user_id}`);
  },

};

export default consumptionPatternApi;
