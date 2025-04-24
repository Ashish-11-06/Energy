
import axiosInstance from "../../../../Redux/axiosInstance";

const holidayListApi = {
  holidayList: () => {
    return axiosInstance.get(`/energy/holiday-list`); 
  },
};

export default holidayListApi;
