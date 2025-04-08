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
    console.log("data in api", data); // Log the data being sent
    return axiosInstance.post(`/month-ahead-generation`, data); 
  },
  uploadTableMonthData: (data) => {
    console.log("data in api", data); // Log the data being sent
    return axiosInstance.put(`/month-ahead-generation`, data); 
  },


  getUpdatedTableMonthData: (id) => {
    return axiosInstance.get(`/month-ahead-generation/${id}`);
  },
};

export default monthAheadApi;
