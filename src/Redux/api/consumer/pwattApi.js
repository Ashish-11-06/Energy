
import axiosInstance from "../../axiosInstance";

const pwattApi = {
  addPWatt: (data) => {
    // console.log('data',data);
    return axiosInstance.post(`/energy/pwatt-hourly`, data); 
  },
};

export default pwattApi;
