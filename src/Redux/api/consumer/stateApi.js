
import axiosInstance from "../../axiosInstance";

const stateApi = {
  states: () => {
    return axiosInstance.get(`/energy/state-list`); 
  },
  districts: (state_name) => {
    console.log('state name',state_name);
    
    return axiosInstance.get(`/energy/districts/${state_name}/`); 
  },
};

export default stateApi;
