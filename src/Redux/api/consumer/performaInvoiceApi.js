import axiosInstance from "../../axiosInstance";

const performaInvoiceApi = {
  performa: (id) => {
    return axiosInstance.get(`/energy/performa-invoice/${id}`);
  },

  createPerforma: (id, data) => {
    return axiosInstance.post(`/energy/performa-invoice/${id}`, data); 
  },
 
};

export default performaInvoiceApi;
