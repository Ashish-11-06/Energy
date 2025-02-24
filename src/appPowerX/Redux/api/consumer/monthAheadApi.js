
import axiosInstance from "../../axiosInstance";

const monthAheadApi = {
  getmonthAhead: () => {
    return axiosInstance.get(`/monthAheadData`, ); 
  },
  getMonthAheadLineData: () => {
    return axiosInstance.get(`/monthAheadLineData`, ); 
  },
  tableMonthData: () => {
    return axiosInstance.get(`/tableMonthData`, ); 
  },
  addTableMonthData: (data) => {
    return axiosInstance.post(`/tableMonthData`,data ); 
  },

};

export default monthAheadApi;
