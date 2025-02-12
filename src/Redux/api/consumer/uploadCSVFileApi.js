import axiosInstance from "../../axiosInstance";

const uploadCSVFileApi = {
  addCSV: (formData) => {
    return axiosInstance.post(`/energy/csv-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default uploadCSVFileApi;
