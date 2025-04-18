import axiosInstance from "../../../../Redux/axiosInstance";

const generatorPortfolioApi = {
  // Fetch all projects by ID
  getAllProjectsById: (id) => {
    return axiosInstance.get(`/energy/generation-portfolio/${id}`);
  },
};

export default generatorPortfolioApi;