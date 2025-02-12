import axiosInstance from "../../axiosInstance";

const termsAndConditionsApi = {
  // Fetch all projects by ID
  addTermsAndConditions: (termsData) => {
    return axiosInstance.post(`/energy/terms-sheet`, termsData);
  },

  addStatus: ({ user_id, term_id, statusData }) => {
    return axiosInstance.put(`/energy/terms-sheet/${user_id}/${term_id}`, statusData);
  },

  updateTermsAndConditions: (userId, termSheetId, termsData) => {
    return axiosInstance.put(`/energy/terms-sheet/${userId}/${termSheetId}`, termsData);
  },
};

export default termsAndConditionsApi;