import axiosInstance from "../axiosInstance";

const templateDownloadApi = {
  // Fetch all projects by ID
  templateDownload: (termsData) => {
    return axiosInstance.post(`/energy/template-downloaded`, templateData);
  },


};

export default templateDownloadApi;