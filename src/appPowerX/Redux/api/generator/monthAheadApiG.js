import axiosInstance from "../../../../Redux/axiosInstance";

const monthAheadApi = {
  getmonthAhead: () => {
    return axiosInstance.get(`/powerx/month-ahead-predictions`); 
  },
  getMonthAheadLineData: () => {
    return axiosInstance.get(`/powerx/monthAheadLineData`); 
  },
//   tableMonthData: () => {
//     return axiosInstance.get(`/tableMonthData`); 
//   },
  addTableMonthData: (data) => {
 // console.log("data in api", data); // Log the data being sent
    return axiosInstance.post(`/powerx/month-ahead-generation`, data); 
  },
  uploadTableMonthData: (data) => {
 // console.log("data in api", data); // Log the data being sent
    return axiosInstance.put(`/powerx/month-ahead-generation`, data); 
  },


  getUpdatedTableMonthData: (id) => {
    return axiosInstance.get(`/powerx/month-ahead-generation/${id}`);
  },
};

export default monthAheadApi;
