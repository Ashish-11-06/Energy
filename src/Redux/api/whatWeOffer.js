import axiosInstance from "../axiosInstance";

const whatWeOffer = {
  whatWeOffer: () => {
    return axiosInstance.get(`/energy/what-we-offer`); 
  },
}

export default whatWeOffer;
