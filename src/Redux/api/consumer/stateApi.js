
import axiosInstance from "../axiosInstance";

const stateApi = {
  states: () => {
    return axiosInstance.get(`/energy/state-list`); 
  },
};

export default stateApi;
