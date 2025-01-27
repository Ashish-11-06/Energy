
import axiosInstance from "../axiosInstance";

const performaInvoiceApi = {
    performa: (id) => {
    return axiosInstance.get(`/energy/performa-invoice/${id}`); 
  },
};

export default performaInvoiceApi;
