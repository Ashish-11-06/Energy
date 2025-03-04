
import axiosInstance from "../../axiosInstance";

const monthAheadApi = {
  getmonthAhead: () => {
    return axiosInstance.get(`/month-ahead-predictions`, ); 
  },
  getMonthAheadLineData: () => {
    return axiosInstance.get(`/month-ahead-predictions`, ); 
  },
  tableMonthData: () => {
    return axiosInstance.get(`/tableMonthData`, ); 
  },
  addTableMonthData: (data) => {
    return axiosInstance.post(`/tableMonthData`,data ); 
  },

};

export default monthAheadApi;
