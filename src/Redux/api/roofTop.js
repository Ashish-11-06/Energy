
import axiosInstance from "../axiosInstance";

const roofTop = {
  requestQuotation: () => {
    return axiosInstance.post(`/energy/send-rooftop-quotation`); 
  },
  getOffersById: (id) => {
    return axiosInstance.get(`/energy/generator-quotation/${id}`);
  }
};

export default roofTop;
