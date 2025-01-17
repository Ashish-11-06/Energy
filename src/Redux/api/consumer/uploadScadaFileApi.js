import axiosInstance from "../axiosInstance";

const uploadScadaFileApi = {
  addScada: ({ id, file }) => {
    return axiosInstance.post(`/energy/scada-file/${id}`, { file });
  },
};

export default uploadScadaFileApi;
