// import axiosInstance from "../../axiosInstance";
import axiosInstance from "../../../../Redux/axiosInstance";

const consumerRequirementApi = {
    getAllrequirementsById: (id) => {
        // console.log(id);
        
        return axiosInstance.get(`/energy/consumer-requirements/${id}`);
    } 
};

export default consumerRequirementApi;