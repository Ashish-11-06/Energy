import axiosInstance from "../axiosInstance";

const roofTop = {
  requestQuotation: (data) => {
    return axiosInstance.post(`/energy/send-rooftop-quotation`, data); 
  },
  getOffersById: (id) => {
    return axiosInstance.get(`/energy/generator-quotation/${id}`);
  },
  getOnSiteOffersById: (id) => {
    return axiosInstance.get(`/energy/generator-quotation/${id}`);
  },
  sendOnSiteOffer: (data) => {
    // data should include: id, sent_from, offered_capacity, price, status (optional: 'Accepted', 'Rejected', or undefined for negotiate)
    return axiosInstance.put(`/energy/generator-quotation`, data);
  }
};

export default roofTop;
