import axiosInstance from "../../axiosInstance";

const downloadReportApi = {
  // Correctly pass parameters for the API request
  report: ({ requirementId, userId }) => {
    return axiosInstance.get(`/energy/download-annual-report/${requirementId}/${userId}`);
  },
};

export default downloadReportApi;
