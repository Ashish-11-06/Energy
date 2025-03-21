import axiosInstance from "../../axiosInstance";

const monthAheadApi = {
  getmonthAhead: () => {
    return axiosInstance.get(`/month-ahead-predictions`); 
  },
  getMonthAheadLineData: () => {
    return axiosInstance.get(`/monthAheadLineData`); 
  },
//   tableMonthData: () => {
//     return axiosInstance.get(`/tableMonthData`); 
//   },
  addTableMonthData: (data) => {
    return axiosInstance.post(`/month-ahead-generation`, data); 
  },
  getUpdatedTableMonthData: () => {
    return axiosInstance.get(`/month-ahead-generation/3`);
  },
};

export default monthAheadApi;
