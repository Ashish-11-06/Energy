
import axiosInstance from "../../axiosInstance";

const monthAheadApi = {
  getmonthAhead: () => {
    return axiosInstance.get(`/monthAheadData`, ); 
  },
};

export default monthAheadApi;
