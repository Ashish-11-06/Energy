
import axiosInstance from "../axiosInstance";

const matchingIPPApi = {
  matchingIpp: (id) => {
    return axiosInstance.get(`/energy/matching-ipp/${id}`); 
  },
};

export default matchingIPPApi;
