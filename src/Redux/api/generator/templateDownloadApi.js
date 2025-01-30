import axiosInstance from "../axiosInstance";

const templateDownloadApi = {
  templateDownload: (templateData) => {
    return axiosInstance.post("/energy/template-downloaded", templateData); // Corrected variable name
  },
};

export default templateDownloadApi;
