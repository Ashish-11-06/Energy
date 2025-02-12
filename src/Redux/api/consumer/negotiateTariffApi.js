
import axiosInstance from "../../axiosInstance";

const negotiateTariffApi = {
  negotiateTariff: (data) => {
    return axiosInstance.post(`/energy/negotiate-tariff-view`, data); 
  },
};

export default negotiateTariffApi;
