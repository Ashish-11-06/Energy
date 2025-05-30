import axiosInstance from "../../axiosInstance";

const demandSummaryApi = {
  getDemandSummary: (id) => {
    return axiosInstance.get(`/energy/demand-summary/${id}`);
  },



};

export default demandSummaryApi;
