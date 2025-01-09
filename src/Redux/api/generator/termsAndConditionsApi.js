import axiosInstance from "../axiosInstance";

const termsAndConditionsApi = {
  // Fetch all projects by ID
  addTermsAndConditions: (termsData) => {
    return axiosInstance.post(`/energy/terms-sheet`, termsData);
  },

};

export default termsAndConditionsApi;