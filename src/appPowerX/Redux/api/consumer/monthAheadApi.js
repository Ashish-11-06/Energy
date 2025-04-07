
import axiosInstance from "../../axiosInstance";

const monthAheadApi = {
  getmonthAhead: () => {
    return axiosInstance.get(`/month-ahead-predictions`, ); 
  },
  addMonthData: (newData) => {
    // console.log('api',newData);
    
    return axiosInstance.post(`/consumer-month-ahead-demand`,newData );
  },
  getMonthAheadLineData: () => {
    return axiosInstance.get(`/monthAheadLineData`, ); 
  },
  tableMonthData: () => {
    return axiosInstance.get(`/consumer-month-ahead-demand/${id}`, ); 
  },
    uploadTableMonthData: (data) => {
      console.log("data in api", data); // Log the data being sent
      return axiosInstance.put(`/consumer-month-ahead-demand`, data); 
    },
  addTableMonthData: (data) => {
    return axiosInstance.post(`/tableMonthData`,data ); 
  },

};

export default monthAheadApi;
