
import axiosInstance from "../../axiosInstance";

const dayAheadApi = {
  getDayAhead: () => {
    return axiosInstance.get(`/tableData`, ); 
  },
};

export default dayAheadApi;
